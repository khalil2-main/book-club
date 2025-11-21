const { options } = require("../routers");


const createUserValidatorsScheama={
  firstname:{
    isLength:{
      options:{
        min:3
      },
      errorMessage:'firstname should at least contains 3 characterss'
    },
    notEmpty:{
      errorMessage:'fill the first,ame field'
    }
  },
  lastname:{
    isLength:{
      options:{
        min:3,
        
      },
      errorMessage:'lastname should at least contains 3 characterss'
    },
    notEmpty:{
      errorMessage:'fill the lastname field'
    }
  },
   admin:{
    optional:true,
    isBoolean:{
      errorMessage:'invalid admin data'
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
  },
  'address.location': {
    optional: true,
    isString: { errorMessage: 'address.location must be a string' }
  },
  'address.city': {
    optional: true,
    isString: { errorMessage: 'address.city must be a string' }
  },
  'address.country': {
    optional: true,
    isString: { errorMessage: 'address.country must be a string' }
  }
}
const updateUserValidatorsScheama={
  firstname:{
    optional: true,
    isLength:{
      options:{
        min:3
      },
      errorMessage:'firstname should at least contains 3 characterss'
    }
  },
  lastname:{
    optional: true,
    isLength:{
      options:{
        min:3,
        
      },
      errorMessage:'lastname should at least contains 3 characterss'
    }
  },
 
  email:{
    optional: true,
    isEmail:{
      
      errorMessage:'invalid email foramat'
    }
  },
  birthday:{
    optional: true,
    isISO8601:{
      
      errorMessage:'invalid date foramat'
    }
  },
  password:{
    optional: true,
    isLength:{
      options:{
        min:8,
        max:30
        
      },
      errorMessage:'password should at least contains 8 characterss'
    }
  },
  admin:{
    optional:true,
    isBoolean:{
      errorMessage:'invalid admin data'
    }
  },

   'address.location': {
    optional: true,
    isString: { errorMessage: 'address.location must be a string' }
  },
  'address.city': {
    optional: true,
    isString: { errorMessage: 'address.city must be a string' }
  },
  'address.country': {
    optional: true,
    isString: { errorMessage: 'address.country must be a string' }
  }
}


//auth
const AuthUserValidatorsScheama={ 
    email:{
    isEmail:{
      
      errorMessage:'invalid email foramat'
    },
    notEmpty:{
      errorMessage:'Email is required'
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
  },

}

module.exports= {createUserValidatorsScheama,updateUserValidatorsScheama, AuthUserValidatorsScheama}