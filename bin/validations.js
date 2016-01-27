module.exports = {
    domain: function(val){
        if(val.length < 3)
            return "El dominio es muy corto, agrega otro"
        return true
    },
    path: function(val){
        if(!/\//.test(val))
            return "Tu path no tiene slash / (tiene que ser ruta exacta)"
        return true
    }
}