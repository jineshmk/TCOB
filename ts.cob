%Vehicular system

abstract class time{
    attributes 
        int Time;
    constraints
        Time=10;
}

class road extends time{
    attributes
        %D-Distance, C-Capacity
        int ID,D,C;
        % S-Start, E-End
        string S,E;
        % V-Vehicle on the road
        int [10][]V;
        %T-traffic
        int []T;

    constraints
       
        forall J in 1..Time:
            forall I in 1..4: (V[J,I]>=0;V[J,I]<=1);
        %Traffic must be less than capacity
        forall I in 1..Time:
            (T[I]>=0;T[I]<=C);
        %Count the number of vehicle present in the road
        forall J in 1..Time: 
             sumlist(V[J],T[J]);
        
   predicates
        sumlist([], 0).
        sumlist([H|T], Sum) :-
            sumlist(T, Rest),{Sum =H + Rest},'!'.
       
    constructors road(ID1,S1,E1,D1,C1){
            ID=ID1; S=S1; E=E1; D=D1; C=C1;
    }
}




%Class vehicle type- represents the basic properties
class vtype{
    attributes
        real MinB,MaxB,MaxA,MaxV;
    constructors vtype(MaxA1,MaxB1,MinB1,MaxV1){
        MaxA=MaxA1;
        MaxB=MaxB1;
        MinB=MinB1;
        MaxV=MaxV1;
    }
}

class vehicle extends time{
    attributes
        int ID;
        string S,E;
        real [10] V,A,P;
        vtype VT;
        %R- roads 
        road []R;
        real [5][4]RI;
        %Road trace
        int [10]RT;
        int []Path;
        %Total number of roads
        int NR;
    constraints
        %Extract ID,S,E,D from every road class, used for path calculation
        forall J in 1..NR:  
                    RI[J]=[R[J].ID,R[J].S,R[J].E,R[J].D];
        %Find the path
        spath(S,E,RI,Path);
        forall J in 1..Time:  (A[J] <= VT.MaxA;
			     A[J] >=-VT.MaxB;
			     V[J]>0;
			     V[J]<=VT.MaxV);
        forall J in 2..Time: (
			    %position and Velocity constraints
			    P[J] = V[J-1]+A[J]/2; 
			    V[J]=V[J-1]+A[J]);
        %IDentify the current road and mark 1 in the corresponding road
        forall J in 1..Time:(getroad(Path,P[J],RT[J]);
                    R[RT[J]].V[J,ID]=1);
                            
    predicates
        
        %Return the series of Road-ID and distance, 
        %which represents the shortestpath 
        spath(X,Y,R,P) :- 
            findall(T,path(X,Y,R,T),Temp),mindist(Temp,[P|_]),'!'.
            
        %Get path from S to E with distance
        path(X,Y,R,P):- directroad(X,Y,R,P).
        path(X,Y,R,[[HID,HD|TID],Di]):- 
                directroad(X,Z,R,[[HID,HD],HD]),
                    path(Z,Y,R,[TID,TD]),{Di=HD+TD}.
        directroad(X,Y,[[ID,X,Y,D]|_],[[ID,D],D]).
        directroad(X,Y,[_|T],P):- directroad(X,Y,T,P).

         %Get the minimum distance path
        mindist([X], X) :- '!'.
        mindist([[P1,X],[P2,Y]|Tail], N):- 
            X > Y,mindist([[P2,Y]|Tail], N).
        mindist([[P1,X],[P2,Y]|Tail], N):- 
            Y >= X,mindist([[P1,X]|Tail], N).
        
        getroad([ID,Di],D,ID)  :- {Di<D},'!'.
        getroad([ID,Di|_],D,ID):- {Di>=D},'!'.
        getroad([_,Di|T],D,ID) :- {DDi = D - Di},getroad(T,DDi,ID),'!'.
    
        
                            
        
    constructors vehicle(ID1,S1,E1,V1,A1,P1,R1,NR1,VT1){
        VT = VT1;
        ID = ID1;
        V[1] = V1;
        P[1] = P1;
        A[1] = A1;
        NR=NR1;
        R=R1;
        S=S1;
        E=E1;
        forall J in 2..Time: A[J]=A[1];
    }   
}

class trafficflow extends time{
    attributes 
        road []R;
        vehicle[] V;
    constraints
          
        %Basic safety property,two vehicle does not exist at 
        %the same road at same position.
        forall V1 in V:
            forall V2 in V:
                forall J in 1..Time: 
                    (not (V1.P[J]=V2.P[J]) :- 
                        not (V1.ID = V2.ID),V1.RT[J]=V2.RT[J]);
    
    constructors trafficflow(R1,V1){
        R=R1;
        V=V1;
    }
}

class environment{

    attributes  
        road [5]R;
        vehicle [4]V;
        vtype [2]VT;
        trafficflow TF;
        
    constraints
        %----Printing-------
        forall I in V:(write('-----------------------------');
            write('\nP--');dump(I.P);write('V--');dump(I.V);write('A--');dump(I.A);write('R--');dump(I.RT));
        
    predicates
         dump([]):-write('\n').
         dump([H|T]) :- write(H),write('|'),dump(T).
    constructors environment(){
        
        VT[1] = new vtype(5,10,20,80);
        VT[2] = new vtype(4,12,25,90);
        
        R[1] = new road(1,a,b,5,3);
        R[2] = new road(2,a,b,4,3);
        R[3] = new road(3,b,c,20,10);
        R[4] = new road(4,b,d,20,8);
        R[5] = new road(5,d,e,20,10);
        
        V[1] = new vehicle(1,a,c,3,1,0,R,5,VT[1]);
        V[2] = new vehicle(2,a,d,3,1,0,R,5,VT[2]);
        V[3] = new vehicle(3,a,b,3,1,0,R,5,VT[1]);
        V[4] = new vehicle(4,b,e,3,1,0,R,5,VT[2]);
        
        TF = new trafficflow(R,V);
    }
}

$