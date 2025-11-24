import Header from "../components/Header";
import LogInForm from "../components/LogInForm";
import SideImage from "../components/sideimage";




function Login(){
  return (
    <>
          <Header />
               <div className="flex items-center justify-center min-h-screen bg-blue-50">
                 <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-8/12">
                   
                   <div className="w-full md:w-1/2 flex items-center justify-center p-2">
                     <LogInForm/>
                   </div>
         
                   <div className="w-full md:w-1/2">
                     <SideImage />
                   </div>
         
                 </div>
               </div>
        </>
  
  )
}

export  default Login;