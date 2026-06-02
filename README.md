# AIS Anomaly Visualization Frontend

 About the Project

This project visualizes anomaly-data through libraries such as maplibre, as base map, and deck.gl as the main visualization library. it is built in react + typescript.

The applictaion allows users to:
- Visualize anomaly clusters on a map
- Switch between different visualization modes.
- Inspect anomaly groups and individual anomaly details
- View signal strength relationships between vessels and base stations/satellites 
- Filter and search anomalies.

## Tech Stack

- React (TypeScript)
- Vite
- Deck.gl
- MapLibre GL
- Node.js / npm
- Docker backend database

## Prerequisites

Make sure you have installed:

- Node.js (https://nodejs.org/en)
- npm (https://nodejs.org/en/download) npm comes installed with Node.js
- Docker and docker compose (required for backend), links : (https://docs.docker.com/engine/install/), (https://docs.docker.com/compose/install/)
- VS code is recommended (optional), link: (https://code.visualstudio.com/download)

## Getting Started

### 1. Clone the repository

### 2.Navigate to the project root directory and install the required dependencies, it is recommended to open the project in visual studio code, or if not open a terminal in the root directory and run ```"npm install" ```

### 3. Run the backend docker container, you will need to follow the guide on https://github.com/NTNU-Bachelor-2026-AIS/ais-viz-backend

### 4. With the backend running, and dependencies installed, the project can be run through the command in terminal ```npm.cmd run dev``` then one can open http://localhost:5173/ais-viz-frontend in a web broweser to access the website. 

[![Demo Video](https://img.youtube.com/vi/uwBdPU44GcQ/0.jpg)](https://youtu.be/uwBdPU44GcQ)
