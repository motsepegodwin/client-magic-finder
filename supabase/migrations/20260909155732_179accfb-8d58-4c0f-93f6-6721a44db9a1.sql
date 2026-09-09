ALTER ROLE authenticator SET pgrst.db_schemas = 'public, graphql_public, bush_taxi';
NOTIFY pgrst, 'reload config';