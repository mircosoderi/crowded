# crowded
_To know how many people are in one place at now and how many have been there in the past. It also could help counter CODIV-19._

## As a citizen
You can:

* know how many people are in a place at now
* display the diagram of presences in a given place in the past
* in some cases, know if you could have had a contact with a person infected by COVID-19

without giving any personal information, and without GPS tracing.

Put a look at the [FAQ](http://crowded.zone/faq.php) to learn how to do that.

## As a decisor

As a decisor, you have something that is:

* [Ready to be used](http://crowded.zone), now!
* Safe and friendly: no sensitive data, no constrictions
* Free, open-source, and collaborative
* Fastly, easily, and cheaply replicable
* Natively multi-language
* Suitable for identifying people flows
* Suitable for identifying contacts of infected people

Put a look at the [FAQ](http://crowded.zone/faq.php) to get introduced to the application. 

Continue reading for a deeper understanding of the replication, internal functioning and other relevant aspects of the application.

## Put a look

![Start](http://crowded.zone/img/screenshots/screen01.png)

![Search](http://crowded.zone/img/screenshots/screen02.png)

![Inspect](http://crowded.zone/img/screenshots/screen03.png)

![Move](http://crowded.zone/img/screenshots/screen04.png)

![Virus](http://crowded.zone/img/screenshots/screen05.png)

![Monitor](http://crowded.zone/img/screenshots/screen06.png)

## Technical aspects

Below here is a detailed dissertation about the most relevant technical aspects of the thing. Feel free to contact me at <mirco.soderi@gmail.com> for any further clarification and support request.

### Replication 

First to be said, [Crowded Zone](http://crowded.zone/) is a production application ready to be used now without the need of installing anything, but if you wish to create your own instance of the application dedicated to your country, region, city, you can do it following these easy steps:

* Get some Web space and access to a MySQL database from a ISP of your preference;

* Upload this whole repository to the Web root;

* Replace "crowded.zone" with your domain name in the PHP pages in the Web root and translate folder;

* Configure the application editing the JSON files in the pvt folder;

* Follow the instructions in the readme file in the translate folder to enable language translations;

* run crowdedzone.sql in your MySQL database;

* Get Android Studio, make a new project, and use resources and source files that you find in the app folder of this repository to create your own Android app. At the very minimum, replace crowded.zone with your domain name in Crowded.java, edit the application name in the manifest, and choose a different package name for your sources. Build, sign, and upload to your Web root. If you have choosen a filename other than crowded.apk for your app, fix the related links in the index, trend, faq, and credits PHP pages.

* OPTIONAL: install your own instance of the Overpass API instead of relying on the Kumi Systems one ([are you sure?](https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances)). Start from [here](https://wiki.openstreetmap.org/wiki/Overpass_API/Installation) if you are determined to do that.

### Functioning

Users open the Web page of the application, and use it. Period. No registration, no personal data, no e-mail, nothing. 

Each user is assigned an internal unique identifier, a number that is stored locally in the user device. If the user clears the cache, the identifier go lost. A new identifier will be assigned. If the user does not move her marker for more than a day, it is ignored by all computations until it is moved again. Dead or forgotten markers does not affect the overall functioning and effectiveness of the application.

When a user moves to a new location, she taps or clicks in the proximity of her destination on the [main map](http://crowded.zone/index.php). A list of places around there display. Then, the user taps or clicks the place where she locates. At that moment, the following happens:

* the position of the user is updated in the database, so the previous position go lost. It is on purpose. No history of movements is kept at the level of the single user;

* a new record is added to the database table dedicated to the monitoring of presences of people in the different places. It contains the identifier of the left place, the number of people standing there computed as the last recorded number of presences minus one, and the timestamp. These records are used to build the diagrams that you can see browsing the [trend map](http://crowded.zone/trend.php);

* a further new record is added to the database table dedicated to the monitoring of presences of people in the different places. It contains the identifier of the reached place, the number of people standing there computed as the last recorded number of people plus one, and the timestamp;

* for each of the people that stands in the reached place at the moment in which the new user arrives, a new record is stored in the contacts table. It contains the identifiers of the two users that got in touch, the identifier of the place, and the timestamp. At the same time, any contact record older than 14 days is permanently deleted. 

Contacts older than 14 days are deleted automatically by the system.

In the case in which a public authority would decide to use this app as one of the tools to fight the COVID-19, contact records allow to identify and notify those users who could have had a contact with an infected person. Here is how it is done:

* the public authority fills the table of infected people indicating their numeric identifiers, and the date and time when they have been found infected. The identifier of the infected person is found displaying  the [main map](http://crowded.zone/index.php) of the application from her device, and looking at the top left corner of the screen.

* Every time that a user loads the [main map](http://crowded.zone/index.php), the system checks to see if she has had a contact with an infected person, using the table of contacts, and the table of infected people, as described above. If yes, the COVID-19 bar is overimpressed at the top of the [main map](http://crowded.zone/index.php). Tapping or clicking on it, the user displays the dates and times of contact. Tapping or clicking one of them, the user displays the place. Then, it is expected that the user communicates to the health authorities of her country that she has could have had a contact with an infected person.

A shortcut is available to speed up the communication of movements. It is the star at the top left corner of the [main map](http://crowded.zone/index.php). Tapping or clicking on it, recently visited places are listed. Tapping or clicking one of them, the movement is performed, without the need of locating the place on the map and perfoming the search and confirm steps. Recent places are stored locally in the user device, and only there. 

### Open source

The source code of the application is in this repository. There's nothing more of that you can find in this repository. You can make of it whatever you wish. Obviously put a look at the Apache Licence v.2.0 under which this application is released, but you will find it to be extremely permissive. 

The map is from the Open Street Map project. Adopting this application, you also indirectly contribute to the development of the Open Street Map project, because people will end up to be encouraged to collaboratively refine the map (everyone can do that, that is the great thing), and organizations will be encouraged to offer Overpass API instances.

Support from me is free and it is only limited by the time that I have in my day (yes, I have a job). 

### Multilanguage

Every single writing that is displayed to the user by this application is translated on the fly using the Google Cloud Translate service. Inaccurate translations can be manually fixed by the administrators editing the translations table in the database.

### App

The Android app is the simplest possible. It just opens a Web browser and loads [http://crowded.zone/](http://crowded.zone), without opening a new tab if the application is already opened in the browser.

## Contacts

Join the [Telegram channel](https://t.me/crowdedapp) and discussion group, or write me at <mirco.soderi@gmail.com>. 