# Node-Cascaron

# PARA CREAR UN TAG
  * git tag -a v0.0.2 -m "modulo 9 terminado"
  * git push --tags
# PARA QUITAR EL SEGUIMIENTO DEL GIT
  * git rm .env --cached
  * agregar el archivo al gitignore , luego add, and commit


# VARIABLES PARA CONFIGURAR "HEROKU"
  * heroku config  -> lista todas la variables de entorno
  * heroku config:set nombreVariable = "variable"  -> Crear variable
  * heroku config:get  -> listar las variables
  * heroku config:unset  nombreVariale  -> eliminar varibale
