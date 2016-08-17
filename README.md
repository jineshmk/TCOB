# TCOB Compiler
- Load Compiler
```sh
?- [main]
```
- Compile TCOB(DCOB),COB program
```sh
?- tcob2swi('test.tcob').
?- dcob2swi('test.dcob').
?- cob2swi('test.cob').
```
-Load compiled code to prolog and run it using main class
```sh
?- [test]
?- test(_,_)
```
