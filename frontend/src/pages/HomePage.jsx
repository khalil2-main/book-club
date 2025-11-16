import axios from "axios";
import Header from "../components/header";
import { useEffect, useState } from "react";


function HomePage(){
  
  const [users, setUsers]=useState([])
  const getUSers= async()=>{
    try{
      let result= await axios.get('api/users')
      setUsers(result.data)
    }
    catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    getUSers()
  },[])
  
    
  return <>
  <Header/>
  {users.length &&users.map((user)=>{
  
    return <h1 key={user.id}> {user.firstName} welcome to our book club</h1>
  })}
  </>
}

 export default HomePage;