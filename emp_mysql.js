var app=angular.module('myApp', ['ngRoute','infinite-scroll','ngFileUpload']);

 app.config(['$routeProvider',function($routeProvider){
    $routeProvider.
    when('/',{
        templateUrl:'emp_list.html',
        controller: 'empCtrl'
    }).
    when('/new/',{
        templateUrl:'emp_new.html',
        controller: 'newCtrl'
    }).
    when('/manager/:id',{
        templateUrl:'emp_manager.html',
        controller: 'managerCtrl'
    }).
    when('/report/:manager',{
        templateUrl:'emp_report.html',
        controller: 'reportCtrl'
    }).
    when('/edit/:id',{
      templateUrl:'emp_edit.html',
      controller:'editCtrl'
    }).
    
    otherwise({redirectTo:'/'});
}]);


app.factory('Emps', function($http, Upload){
       
       var getAllEmps = function(){
          return $http.get('employee/');
        } 
        var getEmpByID =  function(id){
          return $http.get('employee/'+id);
        }
        var getEmpByManager = function(manager){
            return $http.get('employee/manager/'+manager);
        }
        
        var deleteEmpByID = function(id){
           return $http.delete('employee/'+id);
        }
        var updateEmpByID = function(obj){
            return $http.put('employee/'+obj.id,JSON.stringify(obj)).then(function(response){
              if(response.data){
                  console.log("Put Data Method Executed Successfully!");
              }

            });
        }
        var createNewEmp = function(obj){

            return $http.post('employee/',JSON.stringify(obj)).then(function(response){
              if(response.data){
                console.log("Create New User Executed Successfully!");
              }
            });
        }
        var loadMore = function(rawSource, curSource) {
                curSource = rawSource.slice(0, curSource.length + 5);
                return curSource;
          }

      
      return {
          getAllEmps: getAllEmps,
          getEmpByID:getEmpByID,
          getEmpByManager:getEmpByManager,
         
          deleteEmpByID:deleteEmpByID,
          updateEmpByID:updateEmpByID,
          createNewEmp:createNewEmp,
           loadMore:loadMore

      };
    }
    );


app.controller('empCtrl', function($scope, Emps,$location,$route,$window) {

 
Emps.getAllEmps().then(function(msg){
             //$scope.msg = msg;
             var source=angular.fromJson(msg).data;

             $scope.emps = source.slice(0,10);
            
             //console.log(angular.fromJson(msg).data);
          $scope.loadMore = function(rawSource, curSource) {
            console.log("loadMore!");
          $scope.emps = Emps.loadMore(source, $scope.emps);
      }
  });



 




//sort 
$scope.sortType = 'name'; 
$scope.sortReverse = false; 
$scope.searchEmp = ''; 





$scope.deleteEmp = function(id){
  Emps.getEmpByID(id).then(function(msg){
      var emp = angular.fromJson(msg).data;

         //manager change to id don't need to change
      if(emp[0].report!=0){
        console.log(emp[0].name+"-"+emp[0].id);
      Emps.getEmpByManager(emp[0].name+"-"+emp[0].id).then(function(msg){
           var emp2 = angular.fromJson(msg).data;
           var emp_arr = new Array(emp2.length);
           var i;
           for(i=0;i<emp2.length;i++){
                emp_arr[i] = new Object();
                emp_arr[i].id = emp2[i].id;
                emp_arr[i].name = emp2[i].name;
                emp_arr[i].title = emp2[i].title;
                emp_arr[i].phone = emp2[i].phone;
                emp_arr[i].email = emp2[i].email;
                emp_arr[i].manager = 'none';
                emp_arr[i].img_path = emp2[i].img_path;
                emp_arr[i].report = emp2[i].report;
                 console.log(emp_arr[i].manager);
                 Emps.updateEmpByID(emp_arr[i]);

                 




           }
         });

        }
         //manager change to id don't need to change
        if(emp[0].manager!='none'){
          Emps.getEmpByID(emp[0].manager.split('-')[1]).then(function(msg){
                 var ma=angular.fromJson(msg).data;
                 var count = ma[0].report;
                 var obj_ma = new Object();
                     obj_ma.id = ma[0].id;
                     obj_ma.name = ma[0].name;
                     obj_ma.title = ma[0].title;
                     obj_ma.phone = ma[0].phone;
                     obj_ma.email = ma[0].email;
                     obj_ma.manager = ma[0].manager;
                     obj_ma.img_path = ma[0].img_path;
                     obj_ma.report =parseInt(ma[0].report)-1;
                     console.log(obj_ma.report);
                      Emps.updateEmpByID(obj_ma);
                      



            });
        
        }
            

     
      Emps.deleteEmpByID(id);
      $route.reload();
      

  Emps.getAllEmps().then(function(msg){
             
             $scope.emps = angular.fromJson(msg).data;
              $location.path('/');
               $route.reload();
               console.log("delete");




    
            

      });
});

}

});


//report
app.controller('managerCtrl', function($scope, Emps,$location,$route,$routeParams) {
   var id = $routeParams.id;
   console.log(id);
Emps.getEmpByID(id).then(function(msg){
             $scope.msg = msg;
             $scope.manager = angular.fromJson(msg).data;
             console.log(angular.fromJson(msg).data);
            

      });



//sort 
$scope.sortType = 'name'; 
$scope.sortReverse = false; 
$scope.searchEmp = ''; 





// $scope.deleteEmp = function(id){
//   Emps.deleteEmpByID(id);
//   Emps.getEmpByManager(manager).then(function(msg){
             
//              $scope.emps = angular.fromJson(msg).data;
//               $location.path('/report/'+manager);
//                $route.reload();
//                console.log("delete");
    
            

//       });
// };

});


//report
app.controller('reportCtrl', function($scope, Emps,$location,$route,$routeParams) {
   var manager = $routeParams.manager;
   console.log(manager);
Emps.getEmpByManager(manager).then(function(msg){
             $scope.msg = msg;
             $scope.emps = angular.fromJson(msg).data;
             console.log(angular.fromJson(msg).data);
            

      });



//sort 
$scope.sortType = 'name'; 
$scope.sortReverse = false; 
$scope.searchEmp = ''; 





// $scope.deleteEmp = function(id){
//   Emps.deleteEmpByID(id);
//   Emps.getEmpByManager(manager).then(function(msg){
             
//              $scope.emps = angular.fromJson(msg).data;
//               $location.path('/report/'+manager);
//                $route.reload();
//                console.log("delete");
    
            

//       });
// };

});


app.controller('newCtrl', function($scope , $location, $routeParams,Emps,$route,Upload) {

  

  
  
  $scope.id = '';
  $scope.name = '';
  $scope.title = '';
  $scope.phone = '';
  $scope.email = '';
  $scope.manager = '';
  $scope.report = '';
  $scope.img_path = '' ;
  $scope.error = false;
  $scope.incomplete = false; 
 //for selection option
  Emps.getAllEmps().then(function(msg){
             $scope.msg = msg;
             $scope.selection = angular.fromJson(msg).data;

             
             
             });



 
 $scope.$watch('name',function() {$scope.test();});
 $scope.$watch('title',function() {$scope.test();});
 $scope.$watch('phone',function() {$scope.test();});
 $scope.$watch('email',function() {$scope.test();});
 $scope.$watch('manager',function() {$scope.test();});
 $scope.$watch('report',function() {$scope.test();});
 $scope.$watch('img_path',function() {$scope.test();});




$scope.upDate = function(file){
     
     
     var obj=new Object();
     
      
     obj.name = $scope.name;
     obj.title = $scope.title;
     obj.phone = $scope.phone;
     obj.email = $scope.email;

      obj.manager = $scope.manager; //now is id

      obj.report = 0;
      obj.img_path = $scope.img_path;
      var manager_id=obj.manager.split('-')[1];

         //manager change to id don't need to change 
      if(obj.manager!='none'){
        console.log(manager_id);
         Emps.getEmpByID(manager_id).then(function(msg){
          //console.log(obj.manager);
                 var ma=angular.fromJson(msg).data;
                 
                  
                 var obj_ma = new Object();
                     obj_ma.id = ma[0].id;
                     obj_ma.name = ma[0].name;
                     obj_ma.title = ma[0].title;
                     obj_ma.phone = ma[0].phone;
                     obj_ma.email = ma[0].email;
                     obj_ma.manager = ma[0].manager;
                     obj_ma.img_path = ma[0].img_path;
                     obj_ma.report =parseInt(ma[0].report)+1;
                      Emps.updateEmpByID(obj_ma);
                      
                      $route.reload();
                     

                      

            });

      }
      //console.log(obj.manager);
      
    //   //Emps.createNewEmp(obj);
      file.upload = Upload.upload({
      url: 'employee/upload/',
      method:"POST",
      data: {obj:obj, file:file}
    });


      Emps.getAllEmps().then(function(msg){
             
             $scope.emps = angular.fromJson(msg).data;
              $location.path('/');
               $route.reload();
               console.log("create");




    
            

      });
      // $location.path('/');
      // $route.reload();
    
   
      
    
      
};

 $scope.test = function() {

  $scope.incomplete = false;
  if (!$scope.name.length ||
  !$scope.titlle.length ||
  !$scope.phone.length  ||
  !$scope.email.length  ||
  !$scope.manager.length||
  !$scope.report.length 

  ) {
    $scope.incomplete = true;
  }

  };

});
app.controller('editCtrl', function(Emps,$scope, $routeParams, $location,$route,Upload) {
  $scope.changePhoto = false;
  $scope.emps = new Array();
  $scope.id_2 = $routeParams.id;
  console.log($scope.id_2);





            $scope.name = '';
            $scope.title = '';
            $scope.phone = ''; 
            $scope.email = '';
            $scope.manager = '';
            $scope.report = '';
            $scope.img_path ='';

Emps.getEmpByID($scope.id_2).then(function(msg){
             $scope.msg = msg;
             
             $scope.option = angular.fromJson(msg).data;


             //start of selection

                //for selection option
  Emps.getAllEmps().then(function(msg){
             $scope.msg = msg;
             $scope.selection = angular.fromJson(msg).data;
             $scope.res = new Array();
             //console.log($scope.selection.length);
             
            var getAvailableManagers = function (id){
       
                    var i;
                      //console.log('go');
       
                  for(i=0;i<$scope.selection.length;i++){
                       //console.log($scope.selection[i].split)
                  if($scope.selection[i].manager.split('-')[1]==id ){
                 
                 
                     // console.log(i);
                 
                   getAvailableManagers($scope.selection[i].id);
                    $scope.res.push($scope.selection[i]);
                    //console.log($scope.res);
               
           }

          
       }

       
       
}


             getAvailableManagers($scope.id_2);
              $scope.res.push($scope.option[0]);
              //console.log($scope.emps[0]);

              console.log($scope.res);

              var j;
              var k;
              for(j=0;j<$scope.selection.length;j++){

                for(k=0;k<$scope.res.length;k++){
                  if($scope.selection[j].id==$scope.res[k].id){
                    $scope.selection[j].manager='cannotselection';
                  }
                }
              }

              var l;
              $scope.result = new Array();
              for(l=0;l<$scope.selection.length;l++){
                if($scope.selection[l].manager!='cannotselection'){
                      $scope.result.push($scope.selection[l]);
                }
              } 

              //console.log($scope.selection);
             
             });





             //end of selection
              
            
             });

         
    Emps.getEmpByID($scope.id_2).then(function(msg){
             $scope.msg = msg;
             
             $scope.emps = angular.fromJson(msg).data;
             
             $scope.name = $scope.emps[0].name;
             $scope.title = $scope.emps[0].title;
             $scope.phone = $scope.emps[0].phone; 
             $scope.email = $scope.emps[0].email;
             $scope.manager = $scope.emps[0].manager;
             $scope.report = $scope.emps[0].report;
             $scope.img_path = $scope.emps[0].img_path;




             
            

      });
  
 

             
  $scope.error = false;
  $scope.incomplete = false; 
  
  

  $scope.$watch('name',function() {$scope.test();});
 $scope.$watch('title',function() {$scope.test();});
 $scope.$watch('phone',function() {$scope.test();});
 $scope.$watch('email',function() {$scope.test();});
 $scope.$watch('manager',function() {$scope.test();});
 $scope.$watch('report',function() {$scope.test();});
 $scope.$watch('img_path',function() {$scope.test();});




$scope.upDate = function(file){
      var updataObj ={};
      updataObj.id = $routeParams.id;
      updataObj.name = $scope.name;
      updataObj.title = $scope.title;
      updataObj.phone = $scope.phone;
      updataObj.email = $scope.email;
      updataObj.manager = $scope.manager;   //change from manager name to id
      updataObj.report = $scope.report;
      updataObj.img_path = $scope.img_path;

      Emps.getEmpByID($scope.id_2).then(function(msg){ //in employee layer
             $scope.msg = msg;
             
             $scope.emps = angular.fromJson(msg).data;
             var oringinal = $scope.emps[0].manager.split('-');
             if(updataObj.manager.split('-')[1]!=oringinal[1]){
                 console.log(oringinal[0]);
              if(oringinal[0]=='none'){
                 console.log(oringinal[0]);

                 Emps.getEmpByID(updataObj.manager.split('-')[1]).then(function(msg){
                  console.log(updataObj.manager);
                 var ma5=angular.fromJson(msg).data;
                 
                 var obj_ma2 = new Object();
                     obj_ma2.id = ma5[0].id;
                     obj_ma2.name = ma5[0].name;
                     obj_ma2.title = ma5[0].title;
                     obj_ma2.phone = ma5[0].phone;
                     obj_ma2.email = ma5[0].email;
                     obj_ma2.manager = ma5[0].manager; 
                     obj_ma2.img_path = ma5[0].img_path;
                     obj_ma2.report =parseInt(ma5[0].report)+1;
                      Emps.updateEmpByID(obj_ma2);
                     
                       $route.reload();
                     

                      

            });//end of getEmpByID

              }//end of  if(oringinal=='none')

              if(updataObj.manager.split('-')[0]=='none'){
                   Emps.getEmpByID(oringinal[1]).then(function(msg){
                 var new_ma=angular.fromJson(msg).data;
                
                 var obj_ma = new Object();
                     obj_ma.id = new_ma[0].id;
                     obj_ma.name = new_ma[0].name;
                     obj_ma.title = new_ma[0].title;
                     obj_ma.phone = new_ma[0].phone;
                     obj_ma.email = new_ma[0].email;
                     obj_ma.manager = new_ma[0].manager;
                     obj_ma.img_path = new_ma[0].img_path;
                     obj_ma.report =parseInt(new_ma[0].report)-1;
                    
                      Emps.updateEmpByID(obj_ma);
                       
                       $route.reload();
                     



            });


              }
                if(updataObj.manager.split('-')[0]!='none'&&oringinal[0]!='none'){
                     
                    
                     //new +1
                    Emps.getEmpByID(updataObj.manager.split('-')[1]).then(function(msg){
          console.log(updataObj.manager);
                 var ma7=angular.fromJson(msg).data;
                 
                 var obj_ma7 = new Object();
                     obj_ma7.id = ma7[0].id;
                     obj_ma7.name = ma7[0].name;
                     obj_ma7.title = ma7[0].title;
                     obj_ma7.phone = ma7[0].phone;
                     obj_ma7.email = ma7[0].email;
                     obj_ma7.manager = ma7[0].manager;
                     obj_ma7.img_path = ma7[0].img_path;
                     obj_ma7.report =parseInt(ma7[0].report)+1;
                      Emps.updateEmpByID(obj_ma7);
                      
                       $route.reload();
                     



                     //old-1
                        Emps.getEmpByID(oringinal[1]).then(function(msg){
                 var new_ma8=angular.fromJson(msg).data;
                
                 var obj_ma8 = new Object();
                     obj_ma8.id = new_ma8[0].id;
                     obj_ma8.name = new_ma8[0].name;
                     obj_ma8.title = new_ma8[0].title;
                     obj_ma8.phone = new_ma8[0].phone;
                     obj_ma8.email = new_ma8[0].email;
                     obj_ma8.manager = new_ma8[0].manager;
                     obj_ma8.img_path = new_ma8[0].img_path;
                     obj_ma8.report =parseInt(new_ma8[0].report)-1;
                    
                      Emps.updateEmpByID(obj_ma8);

                    
                     
                       $route.reload();


            });

                     

                      

            });//end of getEmpByID

                    
                }

            //end of else 
             }
            
 
  

      });
     

   // Emps.updateEmpByID(updataObj);

        if($scope.changePhoto===true){
        file.upload = Upload.upload({
                         url: 'employee/upload/'+updataObj.id,
                         method:"PUT",
                         data: {obj:updataObj, file:file}
                          });
        $route.reload();

      }
       else{
          Emps.updateEmpByID(updataObj);
       }
        $route.reload();
    //     file.upload.then(function (response) {
    //   $timeout(function () {
    //     file.result = response.data;
    //   });
    // }, function (response) {
    //   if (response.status > 0)
    //     $scope.errorMsg = response.status + ': ' + response.data;
    // }, function (evt) {
    //   // Math.min is to fix IE which reports 200% sometimes
    //   file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    // });
       Emps.getAllEmps().then(function(msg){
             
             $scope.emps = angular.fromJson(msg).data;
              $location.path('/');
               $route.reload();
               console.log("create");




    
            

      });
    
      
};

$scope.test = function() {

  $scope.incomplete = false;
  if (!$scope.name.length ||
  !$scope.titlle.length ||
  !$scope.phone.length  ||
  !$scope.email.length  ||
  !$scope.manager.length||
  !$scope.report.length 

  ) {
    $scope.incomplete = true;
  }

  };


});