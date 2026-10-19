# The Archeville Super-Archy Tournament

## About this assignment

- If you applied for the Full Stack Engineer role, write your solution in Java or JavaScript.  
- Include a README that says how to run your solution.  
- You have 3 days from the day you receive this. If you need more time, tell us.  
- Send your questions, and your solution, to the person who sent you this assignment.

## The tournament

The Archeville Super-Archy Tournament is a team archery competition. It is held once every four years. Every country sends two archers and one reserve archer. A team that reaches 60 points wins.

Every arrow is checked on video by the judges. Archers do get injured. The scoring tablets at the lanes sometimes send broken lines.

### Scoring

- The board has 5 circles, A to E. A is the centre circle and E is the circle furthest from the centre. In round 1, A is worth 5 points and E is worth 1\.  
- Each round, every circle is worth 1 point more than in the round before. In round 4, A is worth 8 and E is worth 4\.  
- An arrow that misses the board is recorded as F. F is always worth 0\.  
- If both archers shooting for a team hit the same circle in a round, the team gets a bonus of 2 points.

### Winning

- The tournament ends at the end of the round in which a team reaches 60 points or more.  
- If more than one team reaches 60 in the same round, the team with the highest score wins.

### Corrections

- After a round, and before the next round starts, the judges may correct any arrow from that round.  
- A correction replaces the circle recorded for that arrow. It does not add a second arrow.

### Substitutions

- Between rounds, a team may replace an injured archer with its reserve. Each team can do this only once.  
- The reserve shoots from the next round onwards. The team keeps all the points it already has.  
- The injured archer's own score stays on the scoreboard. The reserve's score starts at 0\.  
- The bonus is based on the two archers who shot for the team in that round.  
- After a substitution, the ORDER line is sent again. The names may come in a different order.

### Broken lines

- If a round line is incorrect, reject the whole line. Print the line you rejected and the reason. The tablet then sends that round again.  
- Do the same for a correction or a substitution that cannot be applied. Reject it, print the reason, and continue with the next line.

### Explaining a score

- An `EXPLAIN <team>` line asks how that team got its points so far.  
- Print every point the team has earned: the round, the archer, the circle, the points, and any bonus or correction.

## What you are building

You are building the scoreboard. The input starts with the countries and their archers. Next comes an ORDER line. It gives the order in which the archers' results appear in each round line. Then comes one line per round. Correction, substitution and EXPLAIN lines can appear between the round lines. After each round, print each team's score, each archer's score and each team's bonus points. The program stops once a team wins. Before the tournament starts, the judges approve how the scoreboard behaves.

## Tips

- Write a console application. You may read the input from a file (JSON, XML or any other format) if that is easier.  
- We assess your solution on clarity, simple design, how easy it is to extend, and how easily someone else can find out why a score is what it is.  
- The samples below show one way to format the input and output. You may choose your own formats.  
- Do not push your code to a public repository. A private one is fine.  
- Send the code by email. If you upload it to a file-sharing service, make sure anyone with the link can view it.

## What to send

- The code, and a README that says how to run it.

## Sample input

```
TEAMS
Gyrhuna: János Diák, Süsü; reserve Ludas Matyi
Achni: Meilong, Tianlong; reserve Shenlong
Bathar: Pakhangba, Poubi Lai Paphal; reserve Nongpok

ORDER János Diák, Süsü, Meilong, Tianlong, Pakhangba, Poubi Lai Paphal
A,B,C,D,E,F
A,B,C,D,E,F
CORRECTION Süsü: A
EXPLAIN Gyrhuna
A,B,A,A,G,A
A,B,A,A,A,A
SUBSTITUTE Tianlong -> Shenlong
ORDER Meilong, Shenlong, János Diák, Süsü, Pakhangba, Poubi Lai Paphal
A,A,A,B,B,B
A,C,B,C,F,F
```

## Sample output

```
Round 1
Team scores
-----------
Gyrhuna: 9
Achni: 5
Bathar: 1

Individual scores
-----------------
János Diák: 5
Süsü: 4
Meilong: 3
Tianlong: 2
Pakhangba: 1
Poubi Lai Paphal: 0

Bonus points
------------
Gyrhuna: 0
Achni: 0
Bathar: 0

Round 2
Team scores
-----------
Gyrhuna: 20
Achni: 12
Bathar: 3

Individual scores
-----------------
János Diák: 11
Süsü: 9
Meilong: 7
Tianlong: 5
Pakhangba: 3
Poubi Lai Paphal: 0

Bonus points
------------
Gyrhuna: 0
Achni: 0
Bathar: 0

Round 2 (corrected: Süsü B -> A)
Team scores
-----------
Gyrhuna: 23
Achni: 12
Bathar: 3

Individual scores
-----------------
János Diák: 11
Süsü: 10
Meilong: 7
Tianlong: 5
Pakhangba: 3
Poubi Lai Paphal: 0

Bonus points
------------
Gyrhuna: 2
Achni: 0
Bathar: 0

Gyrhuna: 23 points after round 2
Round 1  János Diák  A  5
Round 1  Süsü        B  4
Round 2  János Diák  A  6
Round 2  Süsü        A  6  (corrected from B)
Round 2  Bonus          2  (both hit A)

Rejected line "A,B,A,A,G,A": G is not a circle. Waiting for round 3 again.

Round 3
Team scores
-----------
Gyrhuna: 36
Achni: 28
Bathar: 19

Individual scores
-----------------
János Diák: 18
Süsü: 16
Meilong: 14
Tianlong: 12
Pakhangba: 10
Poubi Lai Paphal: 7

Bonus points
------------
Gyrhuna: 2
Achni: 2
Bathar: 2

Achni: Shenlong replaces Tianlong from round 4.

Round 4
Team scores
-----------
Gyrhuna: 51
Achni: 46
Bathar: 35

Individual scores
-----------------
János Diák: 26
Süsü: 23
Meilong: 22
Tianlong: 12
Shenlong: 8
Pakhangba: 17
Poubi Lai Paphal: 14

Bonus points
------------
Gyrhuna: 2
Achni: 4
Bathar: 4

Round 5
Team scores
-----------
Gyrhuna: 66
Achni: 62
Bathar: 35

Individual scores
-----------------
János Diák: 34
Süsü: 30
Meilong: 31
Tianlong: 12
Shenlong: 15
Pakhangba: 17
Poubi Lai Paphal: 14

Bonus points
------------
Gyrhuna: 2
Achni: 4
Bathar: 4

Game over. Gyrhuna won.
```

