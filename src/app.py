from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv('road_data.csv')  # Your dataset with lat/lon and crash severity
df = df[['Latitude', 'Longitude', 'Crash Severity']].dropna()

# Normalize severity to score values
severity_map = {
    "Fatal Injury": 5,
    "Nonvisible Injury": 3,
    "Visible Injury": 3,
    "Severe Injury": 4,
    "Property Damage Only": 1
}
df['Severity Score'] = df['Crash Severity'].map(severity_map)

# Define grid size (in degrees)
lat_step = 0.01
lon_step = 0.01

# Create grid cell column
df['Lat Bin'] = (df['Latitude'] // lat_step) * lat_step
df['Lon Bin'] = (df['Longitude'] // lon_step) * lon_step

# Aggregate severity scores and counts
grouped = df.groupby(['Lat Bin', 'Lon Bin']).agg(
    crash_count=('Severity Score', 'count'),
    severity_sum=('Severity Score', 'sum')
).reset_index()

# Calculate a final safety score
grouped['safety_score'] = grouped['severity_sum'] / grouped['crash_count']

# Store in dictionary for fast lookup
grid_safety_scores = {
    (row['Lat Bin'], row['Lon Bin']): row['safety_score']
    for _, row in grouped.iterrows()
}

@app.route("/route", methods=["POST"])
def receive_route():
    data = request.get_json()
    route = data.get("route")  # Should be list of dicts: {lat, lng}

    if not route:
        return jsonify({"error": "No route provided"}), 400

    print("Received route")

    # Bin each point on the route and look up safety scores
    scores = []
    for point in route:
        try:
            lat = float(point['lat'])
            lon = float(point['lng'])
            lat_bin = (lat // lat_step) * lat_step
            lon_bin = (lon // lon_step) * lon_step
            score = grid_safety_scores.get((lat_bin, lon_bin))
            if score is not None:
                scores.append(score)
        except (KeyError, ValueError, TypeError) as e:
            print("Skipping invalid point:", point, "Error:", e)

    avg_score = sum(scores) / len(scores) if scores else None
    print("Score is: ", avg_score)


    return jsonify({
        "route_points_scored": len(scores),
        "average_safety_score": avg_score,
        "scores": scores
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
