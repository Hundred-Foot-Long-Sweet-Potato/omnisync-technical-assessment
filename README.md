Instructions on running the project locally:

Requirements:
- Docker (preferrably >4.x)
- .env file

I used the following .env file : DATABASE_URL="postgresql://postgres:dude2132@db:5432/postgres?schema=public"

Use any option you have to see database. I just exec into docker in a cmd with : docker exec -it card_db psql -U postgres -d postgres

Run command:

docker-compose up

------------------------------------------------------

Familiar/Easy Portions:
- Front-end functionality
    - Displaying components
    - UseEffects and other hooks
    - General CSS

Overall I had an easy and familiar time with general front end work. I knew what I was doing and felt comfortable.

Easy but unfamiliar:
- Postgresql
- Tailwind + global.css

I just hadn't used postgres before but other then setting up pgAdmin4 and then connecting the environment it wasn't particularly
difficult and I didn't lose much time.

Tailwind was something I had used but not enough to feel familiar. Due to this I often still used global.css classes to do certain functionality 
like dark mode.

Challenging:
- Docker/prisma/api-routes

I wouldn't say all of this was difficult but overall working with Docker was a learning experience since I hadn't worked with it before. Due to this 
I was struggling for quite a bit trying to figure out the specifics of dockerfiles and docker-compose.yml, though overall I'm happy that I got to 
learn this skill even if it was in the middle of an assessment.

I ended up using prisma for the back-end api routes. Most of this went perfectly fine but there was a moment in time where the back-end was not able to
read my JSON's properly and I did lose time in that. Though this is less so much of a difficulty issue but more so much of my experience in working with the
back-end. Overall though it was just formatting error and it wasn't difficult as much as it just wasted time.

--------------------------------------------------------

Design Decisions:

I believe most of my design decisions are straight forward given the limited scope of the project. I kept things localized to where it was needed
and overall I believe I made good decisions here.

There is a design decision I made regarding animation for shuffling. The two functions with funtion headers that explained the function's function.
For one despite both being animating functions one of them does affect a useState for the cardArray while the other doesn't, this is just weird
but I saw no reason to force functionality into the other function if it didn't need it. 

A second choice I made was how the two different sort functions actually had different parameters. This is because onLoad had a functionality to
sort by First Clicked. While I could of standardized both of them to take in a array parameter I realized that it was actually unnatural for the function
to even have a parameter in the first place given that the following animateShuffleToNewArray directly modified cardArray. Due to this there could be
a weird edge case of having 3 different Arrays being worked on and affecting animateShuffleToNewArray. I didn't test nor want that potential case
so I simply didn't want to include that on the other array.
The reason why I had to include it though on this onLoad though is because setCardArray behaved in a way where it would not set the cardArray before 
I actually did the animation. Due to this I had to pass it on through despite how weird it looks and being the only exception to this function call.
