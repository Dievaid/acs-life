docker build -t database-image .
docker run --name database-container -p 3306:3306 -d database-image