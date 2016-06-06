:- use_module(library(clpr)).

:-assert(settime(10)).
conditional_constraint(A, B) :- ground(B), call(B), !, call(A).
conditional_constraint(A, B) :- !.
% BJ: 2/17/2012 - above rule causes CC to skip when B is non-ground.
%               - may have to revisit this logic.  this is for adex.cob
conditional_constraint(A, _) :- ground(A), call(A), ! .
%changed this clause due to move to SICStus
%conditional_constraint(A, B) :- ground(A), !, not (B).
%BJ(2/12/2012) conditional_constraint(A, B) :- ground(A), !,  naf(B).
conditional_constraint(_, B) :- ground(B), !.
conditional_constraint(A, B) :-
   B =..[CobExists|_],
   name(CobExists, N),	% clpr does not have 'name'; must change it.
   name(cobexists, N1),
   prefix(N1, N),
   call(B), !, call(A).
conditional_constraint(A, B) :-
   B =..[CobExists|_],
   name(CobExists, N),
   name(cobexists, N1),
   prefix(N1, N),
   !.
conditional_constraint(A, B) :-
   (B) =..[\+, C|_],
   C =..[CobExists|_],
   name(CobExists, N),
   name(cobexists, N1),
   prefix(N1, N),
   call(B), !, call(A).
conditional_constraint(A, B) :-
   (B) =..[\+, C|_],
   C =..[CobExists|_],
   name(CobExists, N),
   name(cobexists, N1),
   prefix(N1, N),
   !.

%conditional_constraint(A, _) :- call(A), ! .
%conditional_constraint(_, B) :- \+(call(B)) .

index([_],0,2) :- !.
index([X|_], 1, X) :- !.
index([_,X|_], 2, X) :- !.
index([_,_,X|_], 3, X) :- !.
index([_,_,_,X|_], 4, X) :- !.
index([_,_,_,_,X|_], 5, X) :- !.
index([_,_,_,_,_,X|_], 6, X) :- !.
index([_,_,_,_,_,_,X|_], 7, X) :- !.
index([_,_,_,_,_,_,_,X|_], 8, X) :- !.
index([_,_,_,_,_,_,_,_,X|_], 9, X) :- !.
index([_,_,_,_,_,_,_,_,_,X|_], 10, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,X|_], 11, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,X|_], 12, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,X|_], 13, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 14, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 15, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 16, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 17, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 18, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 19, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 20, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 21, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 22, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 23, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 24, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 25, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 26, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 27, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 28, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 29, X) :- !.
index([_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,X|_], 30, X) :- !.
index(Array, Index, Value) :-
	Index > 30, index(Array, 1, Index, Value).

index([X|_], I, I, X) :- !.
index([_|T], I, N, X) :-
	J is I + 1,
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




