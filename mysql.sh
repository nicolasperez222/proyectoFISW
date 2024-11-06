#!/bin/sh
docker exec -it proyecto-db \
  mysql -p

# cambia los permisos
chmod +x mysql.sh

# se puede ejecutar solo con el nombre del archivo
./mysql.sh