class resistor 
{
 attributes
    real V,I,R;
 constraints
    V = I * R;
 constructors resistor(R1) 
    { R = R1; }
} 
class series2 extends resistor {
 attributes
    resistor [] Cmp;
 constraints
    forall C in Cmp: C.I = I;
    (sum C in Cmp: C.V) = V;
 constructors series2(A) 
    { Cmp = A; }
}

class parallel extends resistor{
 attributes
    resistor [] PC;
 constraints
    forall X in PC: (X.V = V);
    (sum X in PC: X.I) = I;
 constructors parallel(B) 
    { PC = B; }
}

class battery {
 attributes
    Real V;
 constructors battery(V1)
    {V = V1;}
}

class connect {
 attributes
    battery B; resistor CC;
 constraints
    B.V = CC.V ;
 constructors connect(B1, C1) 
   {B = B1; CC = C1 ;}
}

class samplecircuit {
 attributes
    battery B;
    connect C;
    resistor R1, R2, R3, R4;
    resistor P1, P2, S;
 constructors samplecircuit(X) {
    R1 = new resistor(10); 
    R2 = new resistor(20);
    R3 = new resistor(20); 
    R4 = new resistor(20); 
    P1 = new parallel([R1,R2]);
    P2 = new parallel([R3,R4]);
    S = new series2([P1,P2]);
    B = new battery(3);
    C = new connect(B, S);
 }
}

$
Compile

?- cobswi('dc_circuit.cob').

Load
?- [dc_circuit].

Run

?- samplecircuit(_,_).
