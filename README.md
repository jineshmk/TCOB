# TCOB Compiler
The TCOB compiler builts up on the SWI-prolog implementation. In order work with the compiler, the system must have a latest swi-prolog installation. You can download and install Swi-prolog from http://www.swi-prolog.org/download/stable. The user-manual and documentation of Swi-prolog available on http://www.swi-prolog.org/pldoc/index.htm. The TCOB compiler has four files

* dcob2cob.pl,cob2swi.pl - TCOB compiler code, which convert TCOB program into CLP program
* main.pl- Used to load compiler code to prolog environment
* helper_clpr.pl - Collection of TCOB built-in predicates

### Step 1
Download the compiler code and move the four files(main.pl,dcob2cob.pl,cob2swi.pl,helper_clpr.pl) to your prolog working directory
Open swi prolog environment and load the compiler
```sh
$swipl
?- [main]
```
It loads the TCOB compiler into the current prolog environment. Now you can compile the TCOB program(with.tcob extension)
### Step 2
Compile TCOB using tcob2swi('tcobfile.tcob') command. It takes the TCOB program as the input and creates the corresponding CLP program as the output
```sh
?- tcob2swi('test.tcob').
```
This predicates create a prolog file with same as the TCOB program. (eg: test.pl)

### Step 3

Load compiled code(prolog file) to prolog environment using standard prolog load command.
```sh
?- [test]
```
Now you can invoke the program using the driver(main) class predicates int the CLP program. It has two arguments, first arguments represent the list of attributes in the class and second arguments denote the list of arguments to the constructor. If you are not taking any input values, it can represent by _ character 
```sh
?- test(_,_).
```

