parEval(G, C) :- parEval(G,[],C).

parEval(true,C,C).
parEval((A,B), Cin, Cout) :- parEval(A, Cin, Cout1),parEval(B, Cout1, Cout).
parEval(A -> B;C, Cin, Cout):- call(A) -> parEval(B, Cin, Cout); parEval(C, Cin, Cout).
parEval(conditional_constraint(A,B), Cin, Cout ) :- evalCC(A,B,Cout1),(ground(Cout1)->call(Cout1);
append([Cout1],Cin,Cout)).
parEval(G, C, C) :- predicate_property(G,built_in), call(G).
parEval(G, C, C) :- cob_built_in(G), call(G).
parEval(G, C, Out):- predicate_property(G, imported_from(clpr)),append(C,G,Out).
parEval({X = N}, C, C) :- var(X), number(N), call({ X = N }).
parEval({G}, Cin, Cin) :-   ground(G),call({G}).
parEval({G}, C, Out) :- append(C,[{G}],Out).
parEval(G, C, Cout) :- clause(G,Body), parEval(Body,C,Cout).

evalCC(A, B,true) :- ground(B),checkEntailed([B]),call(A).
evalCC(_,B,true) :- ground(B).
evalCC(A, B,conditional_constraint(A,B)).


checkEntailed([]).
checkEntailed([{H}|T]) :- entailed(H),checkEntailed(T).
checkEntailed([H|T]) :- call(H),checkEntailed(T).

cob_built_in(index(_,_,_)).
cob_built_in(makearray(_,_)).
cob_built_in(makearrayofeach(_,_)).
cob_built_in(makelistfromto(_, _, _ )).
cob_built_in(r2i(_,_)).
cob_built_in(plot_graph(_,_,_,_,_,_,_,_,_,_)).


