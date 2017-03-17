plantuml(File,In) :-
    open(File, read,S),
    lex(S,X),
    string_to_list(In,L),tokenize(L,L1),parse_input(VarList,L1,[]),
    close(S),parse(P,X,[]),
    predsort(comparelist,P,PL),process(PL,FL),
    get_plantml_states(FL,VarList,Res),
    getstates(Res,'(*)',Scr),sort(Scr,States),write('@startuml\n'),
    writestates(States),
    write('@enduml\n \n Paste it in: http://www.plantuml.com/plantuml').
    
parse([],[],[]).
parse([X|T]) --> 
   parse1(X),parse(T).
parse1(data(X,Y,Z,V)) --> 
   [id('Time')],['='],[id(X)],[','],[id('Obj')],['='],[id(Y)],
   [','],[id('Var')],['='],[id(Z)],[','],[id('Val')],['='],[id(V)].
   
   
parse_input([],[],[]).
parse_input([X|T]) --> 
   parse_input1(X),[','],parse_input(T).
parse_input([X]) --> 
   parse_input1(X).
parse_input1([Obj,Var]) --> 
   [id(Obj)],['=>'],[id(Var)].

process(P,FL) :-
   get_time_list(P,L),sort(L,SL),time_basedlist(P,SL,TL),
remove_nav(TL,FL).

get_time_list([],[]).
get_time_list([data(X,_,_,_)|T],[X|XT]) :- 
   get_time_list(T,XT).


time_basedlist(_,[],[]).
time_basedlist(P,[X|TT],[L1|L2]) :- 
  find_entry(P,X,L1,Re),time_basedlist(Re,TT,L2).

find_entry([],_,[],[]).
find_entry([data(X,Y,Z,V)|PT],X,[[X,Y,Z,V]|L],Re) :- 
   find_entry(PT,X,L,Re).
find_entry([data(X,Y,Z,V)|PT],T,[],[data(X,Y,Z,V)|PT]) :- 
   X > T,!.  
find_entry(PT,[X],[L],Re) :- 
   find_entry(PT,X,L,Re).
find_entry([_|PT],X,L,Re) :- 
   find_entry(PT,X,L,Re).

remove_nav([],[]).
remove_nav([X|T],[L1|L2]) :- 
   remove_nav1(X,X,L1),remove_nav(T,L2).
remove_nav1(L,[],L).
remove_nav1(IL, [[X,Y,Z,V]|T],OL) :- 
   V='NaV',check(IL,[X,Y,Z,V]),
   delete(IL,[X,Y,Z,V],L),remove_nav1(L,T,OL).
remove_nav1(IL,[_|T],L) :- 
   remove_nav1(IL,T,L).

check([[X,Y,Z,V]|_],[X,Y,Z,IV]) :- V \= IV.
check([_|T],X) :- check(T,X).

comparelist(<,data(X,_,_,_),data(X,_,_,_)).
comparelist(>,data(X,_,_,_),data(Y,_,_,_)) :- X > Y.
comparelist(<,data(X,_,_,_),data(Y,_,_,_)) :- X < Y.


get_plantml_states([],_,[]).
get_plantml_states([X|T],SV,[L1|L2]) :- 
   get_plantml_states1(X,SV,L1),get_plantml_states(T,SV,L2).
get_plantml_states1(_,[],[]).
get_plantml_states1(TL,[[Y,Z]|SVT],L) :- 
  iterate_over_timelist(TL,[Y,Z],L1),
  get_plantml_states1(TL,SVT,L2),append(L1,L2,L).
get_plantml_states1(TL,[[Y,Z]],L1) :- 
   iterate_over_timelist(TL,[Y,Z],L1).

iterate_over_timelist([],_,[]).
iterate_over_timelist([[_,Y,Z,V]|T],[Y,Z],[V|VL]) :- 
   iterate_over_timelist(T,[Y,Z],VL).
iterate_over_timelist([_|T],YZ,L):- 
  iterate_over_timelist(T,YZ,L).
%--------------------------------
getstates([],_,[]).
getstates([X|T],Prev,[[Prev,X]|ResT]) :- getstates(T,X,ResT).
writestates([]).
writestates([[A,B]|T]) :- 
   (A='(*)'->write('(*)');write('"'),write(A),write('"')),write('-->'), 
   write('"'),write(B),write('"\n'),writestates(T).

lex(Stream,Tokens) :-
   get_chars(Stream,L), !,
   tokenize(L,Tokens),!.

get_chars(Str,L) :-
   get_code(Str,C),
   get_chars(Str,C,L).
get_chars(Str,_, []) :- at_end_of_stream(Str). %termination
get_chars(Str,C,  [C|L1]) :-
   get_chars(Str,L1).

tokenize([], []) :- !.
tokenize([C|L], L3) :-
   white(C), !, skip_whites(L,L2),
   tokenize(L2,L3).

tokenize([C|L], [X|L3]) :-
   alpha(C), identifier(X,[C|L],L2), !,
   tokenize(L2,L3).


tokenize(L, [X|L3]) :-
   special(X,L,L2), !,
   tokenize(L2,L3).
   


tokenize([C|_L], _) :-
   print('Error: Cannot tokenize the character1: '),
   name(BadChar, [C]),
   print(BadChar),
   fail.
   
skip_whites([], []).
skip_whites([C|L], L2) :-
   (white(C) -> skip_whites(L,L2); L2 = [C|L]).

white(9).  % tab
white(32). % blank
white(10). % newline
white(13). %carriage return
special(',',[44|L],L).
special('=>',[61,62|L],L).
special(=,[61|L],L).




identifier(id(N)) --> 
   ident(L), {name(N,L)}.

ident([X|L]) --> 
   letter(X), ident(L).
ident([X])   --> 
   letter(X).
   
letter(X) --> 
   [X],  {alpha(X)}.

alpha(X) :-  X > 64,  X < 91.
alpha(X) :-  X > 96,  X < 123.
alpha(X) :- X > 47,  X < 58.
alpha(95). % ascii value of _
alpha(46).
alpha(45).

