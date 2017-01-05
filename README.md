# TCOB Compiler
The TCOB compiler builts up on the SWI-prolog implementation. In order to work with the compiler, the system must have a latest swi-prolog installation. You can download and install Swi-prolog from http://www.swi-prolog.org/download/stable. The user-manual and documentation of Swi-prolog available on http://www.swi-prolog.org/pldoc/index.htm. The TCOB compiler has four files

* tcob2swi.pl, - TCOB compiler code, which convert TCOB program into CLP program
* helper_clpr.pl - Collection of TCOB built-in predicates

### Step 1
Download the compiler code and move into the two files(tcob2swi.pl, helper_clpr.pl) to your prolog working directory
Open swi prolog environment and load the compiler
```sh
$swipl
?- [tcob2swi]
```
It loads the TCOB compiler into the current prolog environment. Now you can compile the TCOB program(with.tcob extension)
### Step 2
Compile TCOB using tcob2swi/2 command. It takes the TCOB program and driver class constructor as the input and creates the corresponding CLP program as the output
```sh
?- tcob2swi('test.tcob','test()').
```
This predicates create a prolog file with same as the TCOB program.

### Step 3

Load compiled code(prolog file) to prolog environment using standard prolog load command.
```sh
?- [test]
```
Now you can invoke the program using the driver(main) class predicates int the CLP program. It has two arguments, first argument represents the list of attributes in the class and second argument denotes the list of arguments to the constructor. If you are not taking any input values, it can represent by _ character 
```sh
?- main(_,_).
```

