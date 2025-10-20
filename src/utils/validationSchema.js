const { options } = require("../routers");

const UserValidatorsScheama={
  prenom:{
    isLength:{
      options:{
        min:3
      },
      errorMessage:'name should at least contains 3 characterss'
    },
    notEmpty:{
      errorMessage:'fill the name field'
    }
  },
  nom:{
    isLength:{
      options:{
        min:3,
        
      },
      errorMessage:'surname should at least contains 3 characterss'
    },
    notEmpty:{
      errorMessage:'fill the surname field'
    }
  },
 
  email:{
    isEmail:{
      
      errorMessage:'invalid email foramat'
    },
    notEmpty:{
      errorMessage:'Email is required'
    }
  },
  birthday:{
    isISO8601:{
      
      errorMessage:'invalid date foramat'
    },
    notEmpty:{
      errorMessage:'birthday is required'
    }
  },
  password:{
    isLength:{
      options:{
        min:8,
        max:30
        
      },
      errorMessage:'password should at least contains 8 characterss'
    },
    notEmpty:{
      errorMessage:'password is required'
    }
  }
}

module.exports= {UserValidatorsScheama}