# TCOB Compiler
- Download and install Swi-prolog from http://www.swi-prolog.org/download/stable  

- Download the compiler code and move the four files(main.pl,dcob2cob.pl,cob2swi.pl,helper_clpr.pl) to your prolog working directory
-  Open swi prolog environment and load the compiler code using below command.
```sh
?- [main]
```
- Compile TCOB using tcob2swi('tcobfile.tcob') command. It creates a prolog file with same name as the TCOB program 
```sh
?- tcob2swi('test.tcob').
```
- Load compiled code(prolog file) to current prolog environment and call the constructor of TCOB driver class
```sh
?- [test]
?- test(_,_)
```
