# TCOB Compiler
The TCOB compiler builts up on the SWI-prolog implementation. In order work with the compiler, the system must have a latest swi-prolog installation. You can download and install Swi-prolog from http://www.swi-prolog.org/download/stable. The user-manual and documentation of Swi-prolog available on http://www.swi-prolog.org/pldoc/index.htm. The TCOB compiler has four files

* dcob2cob.pl,cob2swi.pl - TCOB compiler code, which convert TCOB program into CLP program
* main.pl- Used to load compiler code to prolog environment
* helper_clpr.pl - Collection of TCOB built-in predicates

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
