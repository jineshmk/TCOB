class adexneuron{
attributes
 real C;
 real Gleak;
 real Eleak;
 real Delta;
 real Vt;
 real A;
 real B;
 real Tw;
 real Vr;
 real []W;
 real []Vm;
 int []Flag;
 real []SpikeTrain;
 real Iin;
 real V;
 real E;
 real Dt;

constraints
 
    C  *   ( Vm[Time]  -  Vm[Time-1])  /  Dt  =   - Gleak  *   ( Vm[Time-1]  -  Eleak)  -  W[Time-1]  +  Iin  +  Gleak  *  Delta  *  pow(E, ( Vm[Time-1]  -  Vt)  /  Delta):-   Flag[Time]  =  1;
      Tw  *   ( W[Time]  -  W[Time-1])  /  Dt  =  A  *   ( Vm[Time-1]  -  Eleak)  -  W[Time-1]:-   Flag[Time]  =  1;
      addtoarray(SpikeTrain,Time  *  Dt):-   Flag[Time]  =  0;
      Vm[Time+1]  =  Vr:-   Vm[Time]  >   - 32;
      W[Time+1]  =  W[Time]  +  B:-   Vm[Time]  >   - 32;
      Flag[Time+1]  =  0:-   Vm[Time]  >   - 32;
         Flag[Time+1]  =  1:-   Vm[Time]  =<   - 32;
constructors
adexneuron( Time, Cap,GV,EE,D1,V1,A1,B1,WW,T1,Vr1,I1){Gleak  =  GV;
   Eleak  =  EE;
   Delta  =  D1;
   Vt  =  V1;
   A  =  A1;
   B  =  B1;
   WW  =  W[1];
   Tw  =  T1;
   Vr  =  Vr1;
   Iin  =  I1;
   C  =  Cap;
   E  =  2.71828;
   V  =   - 60;
   Dt  =  0.02;
   Flag[2]  =  1;
      Vm[1]  =   - 60;}

}

class network{
attributes
 adexneuron [10]Adex;

constraints
 
    forall I in 1..10:(   Adex[I] = new adexneuron( Time, 200.00,10.00,-70.00,2.00,-50.00,2.00,0.00,0.00,30.00,-58.00,500.00));
constructors
network( Time){}

}

class main
{
   attributes
      network Main;
   constructor main(){forall Time in 2..5000:(
Main = new network(Time));
}
}
$