Admin panel updates a json file and uploads it to AWS S3 Bucket System and every time Components mount,
the settings.json file is fetched from AWS S3 and used afterwards.
This implementation is obviously not ideal, not optimal and may cause inconsistency

Rather the implementation of a database system would be much more efficient and consistent but it
would require backend engineering, which I am quite capable to do so but the indications of the project
were clear that the project was not to use backend. The best I could come up with was this system.

