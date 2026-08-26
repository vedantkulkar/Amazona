#!/usr/bin/env bash
echo "==================================================="
echo "  Starting Amazona Java Full Stack Application...  "
echo "==================================================="

(cd spring-backend && ./mvnw spring-boot:run) &
BACKEND_PID=$!

(cd frontend && npm start) &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

echo "Application instances launching!"
echo " - Backend API: http://localhost:5000"
echo " - Swagger UI: http://localhost:5000/swagger-ui.html"
echo " - Health Check: http://localhost:5000/actuator/health"
echo " - React App: http://localhost:3000"

wait
