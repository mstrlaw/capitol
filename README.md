# Capitol

> From [Wikipedia](https://en.wikipedia.org/wiki/2021_storming_of_the_United_States_Capitol)
>
> The storming of the United States Capitol was a riot and violent attack against the 117th United States Congress on January 6, 2021, carried out by a mob of supporters of U.S. President Donald Trump in an attempt to overturn his defeat in the 2020 presidential election. After attending a Trump rally, thousands of his supporters marched down Pennsylvania Avenue to the Capitol, where a joint session of Congress was beginning the Electoral College vote count. These rioters occupied, vandalized, and looted parts of the building for several hours. The riot led to the evacuation and lockdown of the Capitol, and five deaths.

This project aims to collect social media videos and provide a dynamic way to explore the events described above.

We want it to be an archive of all the events that transpired, all explorable and easily searchable. We're looking to enhance the related metadata of each video (location, annotation, speech-to-text, etc). If you have ideas to help enhance this page let us know.

## Contribute

There are two main ways to help:
- pinpoint the location of videos that don't have a location or have a wrong location;
- classify the contents of each video to make it easier to filter through each category;

### Identifying locations

The process to help enhance the location accuracy is:
1. Copy the ID of the video you're watching for reference;
2. Open a new [Enhance Location](https://github.com/mstrlaw/capitol/issues/new?assignees=mstrlaw&labels=enhancement&template=enhance-location.md&title=Enhance+Location%3A+%3CVIDEO-ID%3E) issue;
3. Fill the issue as described;
4. Submit it;

We'll review it and improve the data source.

#### Tips for location accuracy

The amount of effort you want to put into identifying the location of a video is up to you. A rough approximation is enough. Here are some tips for visual recon:

**[Google Maps](https://www.google.com/maps/@38.8896155,-77.010188,1138a,35y,359.75h,0.2t/data=!3m1!1e3)** is definitely the best tool at your disposal; use it extensively:

##### Google Maps Street View

Luckily, Google Maps has plenty of locations you can use to identify the location of videos:


**[Virtually Anywhere](https://www.virtually-anywhere.com/portfolio/uscapitol/)** does virtual tours of the Capitol, useful indoor recognition.


### Annotating video categories

We're come up with 10 descriptive tags and 3 directly related to individuals seen in the videos.

The process to help enhance the classification is:
1. Copy the ID of the video you're watching for reference;
2. Open a new [Enhance Categories](https://github.com/mstrlaw/capitol/issues/new?assignees=mstrlaw&labels=enhancement&template=enhance-categories.md&title=Enhance+Categories%3A+%3CVIDEO-ID%3E) issue;
3. Fill the issue as described;
4. Submit it;

We'll review it and improve the data source.

#### Descriptive:
- `vlog`: someone talking to the camera or narrating events;
- `music`: music can be heard;
- `chants`: chants can be heard, which inlcude people singing or religious chants;
- `conversation`: distinct conversations can be heard between people on or off the video frame;
- `riot`: riot scenes are depicted in the video (groups of people);
- `violence`: scenes of violence are depicted in the video (excludes verbal violence);
- `police`: police can be seen in the video;
- `speech`: someone giving a speech can be heard between on or off the video frame;
- `trespassing`: people attempting to or entering the Capitol premises;
- `antifa`: people can be seen displaying Antifa/BLM symbols (ex. flags, signs) — by default we assume depicted people are not from that movement;
- `trump`: Trump can be seen (ex. during a speech);
- `roger-stone`: Roger Stone can be seen;
- `alex-jones`: Alex Jones can be seen;

## Sources

Videos have been collected from a series of locations:

- Parler leaked videos retrieved from [Tommy Carstensen](https://twitter.com/carstensenpol/)'s [hosted page](https://www.tommycarstensen.com/terrorism/index.html), which include geo locations;
- Parler, Twitter, Instagram, Liveleak, Youtube and Facebook videos retrieved from a [mega.nz folder](https://mega.nz/folder/30MlkQib#RDOaGzmtFEHkxSYBaJSzVA), collected throught [this Reddit thread](https://www.reddit.com/r/DataHoarder/comments/krx449/megathread_archiving_the_capitol_hill_riots/) from user [AdamLynch](https://www.reddit.com/user/AdamLynch/). These do not include location information upon uppload;

## Video hosting

- To enhance the experience, we're downloading, compressing+converting the videos and serving them ourselves;
- If there's a video you'd like to be made available, please open a ticket;
