:- use_module(library(clpr)).
:- use_module(library('plot/plotter')).
:- use_module(library(autowin)).

:-assert(settime(2)).
conditional_constraint1(A,B) :- call(B), !, call(A).
conditional_constraint(A, B) :-!, when(ground(B), conditional_constraint1(A,B)).
conditional_constraint1(A, B) :- !.
% BJ: 2/17/2012 - above rule causes CC to skip when B is non-ground.
%               - may have to revisit this logic.  this is for adex.cob
conditional_constraint1(A, _) :- ground(A), call(A), ! .
%changed this clause due to move to SICStus
%conditional_constraint(A, B) :- ground(A), !, not (B).
%BJ(2/12/2012) conditional_constraint(A, B) :- ground(A), !,  naf(B).
conditional_constrain1t(_, B) :- ground(B), !.
conditional_constraint1(A, B) :-
   B =..[CobExists|_],
   name(CobExists, N),	% clpr does not have 'name'; must change it.
   name(cobexists, N1),
   prefix(N1, N),
   call(B), !, call(A).
conditional_constraint1(A, B) :-
   B =..[CobExists|_],
   name(CobExists, N),
   name(cobexists, N1),
   prefix(N1, N),
   !.
conditional_constraint1(A, B) :-
   (B) =..[\+, C|_],
   C =..[CobExists|_],
   name(CobExists, N),
   name(cobexists, N1),
   prefix(N1, N),
   call(B), !, call(A).
conditional_constraint1(A, B) :-
   (B) =..[\+, C|_],
   C =..[CobExists|_],
   name(CobExists, N),
   name(cobexists, N1),
   prefix(N1, N),
   !.

%conditional_constraint(A, _) :- call(A), ! .
%conditional_constraint(_, B) :- \+(call(B)) .


index(1,[X|_], X) :- !.
index(2,[_,X|_], X) :- !.
index(3,[_,_,X|_], X) :- !.
index(4,[_,_,_,X|_], X) :- !.
index(5,[_,_,_,_,X|_], X) :- !.
index(6,[_,_,_,_,_,X|_], X) :- !.
index(7,[_,_,_,_,_,_,X|_], X) :- !.
index(8,[_,_,_,_,_,_,_,X|_],  X) :- !.
index(9,[_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(10,[_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(11,[_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(12,[_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(13,[_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(14,[_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(15,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], X) :- !.
index(16,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(17,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(18,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(19,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(20,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(21,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(22,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(23,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(24,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(25,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(26,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(27,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(28,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(29,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(30,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(31,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(32,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(33,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(34,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(35,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(36,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(37,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(38,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(39,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(40,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(41,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(42,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(43,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(44,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(45,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(46,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(47,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(48,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(49,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index(50,[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_],  X) :- !.
index( Index, [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_|T],Value) :-
Index > 50 ,NI is Index-50,NI>0,index(NI,T, Value).


index([X|_], I, I, X) :- !.
index([_|T], I, N, X) :-
	J is I + 1, J=<N,
	index(T, J, N, X).

output([]).
output([X|T]) :- print(X), nl, output(T).

makearray([N], V) :- !, sizeof(V, N).
makearray([N|Rest], V) :- !, sizeof(V, N), makearrayofeach(Rest,V).
makearray(_,_). % when array dimensions are left unspecified.

makearrayofeach(NL,[V]) :- makearray(NL, V), !.
makearrayofeach(L, [V1|Rest]) :- makearray(L, V1), makearrayofeach(L,Rest).

sizeof([], 0) :- !.
sizeof([_|T], M) :-
	N is M-1,
	sizeof(T, N).

min(X,Y,Z) :- ((nonvar(X), nonvar(Y)) -> (Z is min(X,Y))
				      ; (nonvar(X) -> Z=X
				                   ; (nonvar(Y) -> Z=Y
						                 ;true))).

max(X,Y,Z) :- ((nonvar(X), nonvar(Y)) -> (Z is max(X,Y))
				      ; (nonvar(X) -> Z=X
					            ; (nonvar(Y) -> Z=Y
						                 ; true))).

makelistfromto(M, M, [M]):-!.
makelistfromto(N, M, [N|NtoM]) :-
	N < M,
	N1 is N+1,
	makelistfromto(N1, M, NtoM),!.

naf(B) :- call(B), !, fail.
naf(B).

r2i(R,I) :-  I is round(R).
%Temporal operators definition

cobF(I,T,C,Val)     :- X is I+T,index(C,X,CI),
                       CI = Val.
cobF(Lo,Hi,T,C,Val) :- random(Lo,Hi,S), X is T+S,
                      index(C,X,CI),CI=Val.

cobG(Lo,Hi,T,C,Val) :- Lo < Hi, X is Lo+T,
                       index(C,X,CI), CI=Val,Lo1 is Lo+1,
                       cobG(Lo1,Hi,T,C,Val).
cobG(Lo,Lo,T,C,Val). 


% ------------------------------------------------------
removevar([], []).
removevar([X|Xs], Z) :- var(X), removevar(Xs, Z), !.
removevar([X|Xs], [X|Zs]) :- removevar(Xs,Zs).

removevar([], 0).
removevar([X|Xs], Z) :- var(X), removevar(Xs, Z), !.
removevar([X|Xs], [X|Zs]) :- removevar(Xs,Zs).

plot_graph(Title,L,XLo,XHi,YLo,YHi,Width,Height,Spacing,TG) :-
        removevar(L,LN),
        new(W, auto_sized_picture(Title)),
        send(W, display, new(P, plotter)),
        send(P, axis, new(X, plot_axis(x, XLo, XHi, Spacing, Width))),
        send(P, axis, plot_axis(y, YLo, YHi, @default, Height)),
        send(X, format, '%i'),
        send(P, graph, new(G, plot_graph)),
        plot_function(LN, 1, G,TG),
        send(W, open).

plot_function([], _,_,_) :-
        !.
plot_function([Y|T], X, G,TG) :-
        send(G, append, X, Y),
        X2 is X+TG,
        plot_function(T, X2, G,TG).
%===File write
dump_to_file([],[]).
dump_to_file(N,V) :-
            open('output.csv',append,Stream),write_to_file(Stream,N,V),
            close(Stream).
write_to_file(_,[[]],_).
write_to_file(Stream,[N],[[V]]):-
            write_to_file(Stream,[N],[V]).
write_to_file(Stream,[Name|Tail],[X|T]) :-
            write(Stream,Name),write(Stream,','),
            removevar(X,NX),dumpval(Stream,NX),put(Stream,10),
            write_to_file(Stream,[Tail],[T]).
dumpval(_,[]).
dumpval(Stream,[X|T]) :-
            write(Stream,X),write(Stream,','),dumpval(Stream,T).

addval(H,V) :- var(H),{H=V}.
addtoarray([H|_] , V ):- addval(H,V).
addtoarray([_|T],V ) :- addtoarray(T,V).
