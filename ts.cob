
class vehicle{
      attributes 
	Real A,B;
      constraints 
	B = 0:- A < 6;
	
	
	constructors vehicle(InA){
	A =InA;
	
	}
	

}




class test1{
	attributes 
	vehicle V;
	
	constraints
	dump1(V.A);
	predicates
	
	dump1(X):- write(X).
	constructors test1(){
		V= new vehicle(5); 
	}
}

$