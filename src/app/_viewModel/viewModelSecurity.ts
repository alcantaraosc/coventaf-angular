import { funciones } from "../_models/funciones"
import { funcionesRoles } from "../_models/funcionesRoles"
import { roles } from "../_models/roles"
import { rolesUsuarios } from "../_models/rolesUsuarios"
import { usuarios } from "../_models/usuarios"

export interface viewModelSecurity {
    funciones?: funciones
    roles?: roles
    funcionesRoles?: funcionesRoles[]
    usuarios?: usuarios
    rolesUsuarios?: rolesUsuarios[]
}
