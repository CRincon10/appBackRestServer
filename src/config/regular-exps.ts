export const regularExps = {

    // email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,

    //minimo una mayuscula, una minuscula un numero y minimo 8 digitos
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d.]{8,}$/

}