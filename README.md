# TCOB Compiler
- Install latest Swi-prolog 
```sh
  Download and install Swi-prolog from http://www.swi-prolog.org/download/stable  
```
- Load Compiler
```sh
  Download the compiler code and move the four files(main.pl,dcob2cob.pl,cob2swi.pl) to your prolog working directory
  Open swi prolog environment and load the compiler code using below command.
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
