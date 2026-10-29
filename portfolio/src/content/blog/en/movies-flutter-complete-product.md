---
title: MoviesFlutter: integrating catalog, identity, and persistence
slug: movies-flutter-complete-product
excerpt: A study of a Flutter application that separates TMDB data, local caching, and persistent favorites while stating its consistency limits.
publishedAt: 2026-10-21
category: Project study
tags: [Flutter, TypeScript, PostgreSQL, Mobile]
featured: true
hasDemo: false
---
# A catalog is only the beginning

Displaying popular movies exercises API consumption, but it does not by itself constitute a coherent product. The problem expands when identity, search, per-user persistence, and continuity across sessions become part of the same flow.

MoviesFlutter was built around that second goal. It uses Flutter on mobile, a TypeScript API with Express, and PostgreSQL. Public movie data comes from TMDB. Accounts and favorites belong to the product itself.

That separation looks simple, but it shapes almost every important decision in the project.

![Actual CineFlutter catalog with search, posters, and favorites](/blog/movies-catalog.webp)

*Project screen: search sits above the catalog, and the heart marks favorite movies. Image from the original repository.*

## Two kinds of data, two responsibilities

The TMDB catalog is an external source. It provides titles, summaries, artwork, and discovery data. Copying the whole catalog into the local database would add synchronization work without improving the experience.

Favorites have a different purpose. They represent a personal choice and must be connected to an account. They belong in PostgreSQL and go through the project's API.

| Data | Source | Reason |
| --- | --- | --- |
| Popular movies | TMDB | Content maintained by a specialized source |
| Search results | TMDB | Broad and current catalog |
| Account | Project API | Identity controlled by the product |
| Favorites | PostgreSQL | Durable preference tied to a user |

![Diagram of the MoviesFlutter data sources](/blog/movies-system-en.svg)

The diagram captures a boundary visible in the code: the client reads movies from TMDB, but reads and changes favorites through an authenticated Express API. The database stores movie IDs by user; when the list opens, the app uses those IDs to retrieve details from TMDB.

The interface brings both sources together without hiding where they came from. If the external catalog fails, the screen should explain the problem. If a session expires, the person must sign in again before changing favorites. Each failure needs a different response.

## Authentication protects a concrete action

The project supports registration and sign-in with protected passwords and JWT tokens. A token is temporary proof that the API recognized a session. It accompanies calls that read or change favorites.

Issuing the token is only one part of the job. The API must validate it on every private route and use the validated identity to find the right data. The client should never be free to choose another user's identifier.

This creates a clear journey:

1. A person creates an account or signs in.
2. The API returns a valid session.
3. The app uses that session when reading favorites.
4. The API connects each change to the signed-in user.
5. An invalid session returns to sign-in with a direct message.

Authentication becomes part of the product experience instead of an isolated screen.

![Actual CineFlutter sign-in screen](/blog/movies-login.webp)

*Sign-in opens account-owned favorites; the public catalog remains a separate source.*

## Flutter as a client of a larger system

The app uses Riverpod in its authentication and favorites providers, Dio for HTTP calls, and go_router for navigation. The project also lists Provider as a dependency, but the favorites flow inspected here is implemented with Riverpod. That distinction matters: the article should describe the code, not only the package list.

There is another useful choice: the popular catalog goes through a repository that fetches remote data and stores it locally with Floor. The screen watches a stream from that database. Local caching serves catalog reading, while favorites remain attached to an account on the server.

Interface state should answer visible questions: is a search running, empty, or unsuccessful? Is this movie already a favorite? Is the session still valid? Treating these states separately prevents jumps and conflicting messages.

Navigation must also match the product. Sign-in, catalog, details, and favorites are more than pages. They form a path that should remain understandable when someone goes back, searches again, or loses a connection.

## The backend keeps the central rule

Express receives requests, Sequelize communicates with PostgreSQL, and Docker Compose brings the services together for development. This keeps the mobile client focused on presentation and interaction.

Ownership rules stay in the API. It decides which favorites belong to the current session. It also protects passwords and validates incoming data.

This division prepares the project for another client, such as a web interface, without copying important rules.

## A slow connection changes the priority

A movie app works with many images. On a fast network, it is easy to miss the cost of loading large posters or requesting the same list several times. On an unstable mobile connection, those details decide whether the screen feels ready or stuck.

The first response does not need to be a complex caching system. The app can begin with direct measures:

- request images at the size where they will be displayed;
- load visible items first;
- keep the last useful result during an update;
- avoid a new search when the text has not changed;
- show a placeholder with the same dimensions as the poster.

The placeholder prevents content from jumping when the image arrives. Keeping the previous result avoids an empty screen between two requests. Both choices improve perceived speed without pretending that the network answered early.

Favorites require extra care. The interface can respond to a tap quickly, but it should show when the save is still in progress. If the API rejects the change, the visual state must return to the confirmed value. Perceived speed cannot create false information.

`FavoritesNotifier` already performs that rollback: adding or removing a movie updates the local list first; if the API call fails, the provider restores the previous state. It is a concrete optimistic update. The next refinement is to tell the user about the failure, because the current `catch` restores state without a specific message.

## Error states belong to navigation

A TMDB failure does not mean sign-in stopped working. A failure in the project API does not mean the public catalog is unavailable. Treating everything as one generic error wastes the separation between services.

Messages can guide the next action:

| Situation | Useful response |
| --- | --- |
| Catalog unavailable | Keep navigation available and offer another attempt |
| Session expired | Explain that sign-in is required again |
| Favorite not saved | Restore the confirmed state and allow a retry |
| Device offline | Preserve loaded content and explain the condition |

This precision reduces frustration. People understand what still works and what they can do next.

## Validation must cross the layers

The mobile form can reject an invalid email format or an empty password. That helps someone correct the value before sending it. The API must still repeat every important check.

The person using the app controls the client. A request can be sent without going through the original screen. Authentication, ownership, and format rules therefore stay on the server. The client anticipates common mistakes; the API decides what it accepts.

Database constraints complete that protection. An account needs a stable identifier, and a favorite relationship should not create copies of the same movie for one user. Each layer protects a different part of the system.

The current code uses `findOrCreate` to avoid adding a movie twice and returns `409` when it is already present. The Sequelize model, however, does not declare a compound unique constraint on `user_id` and `movie_id`. Under concurrent requests, the database needs that constraint to guarantee the rule. This is a verifiable limit of the current implementation.

## How I would verify the journey

Testing isolated components is useful, but this product needs scenarios that cross the app and the API. The most valuable cases begin with an action a person would actually take:

1. create an account and sign in;
2. search for a movie and open its details;
3. add the movie to favorites;
4. close the session and sign in again;
5. confirm that the favorite is still available;
6. remove the item and verify the interface response.

The same journey should run with a slow API, an invalid catalog response, and an expired token. Those scenarios reveal missing messages and states that only look correct on the ideal path.

The goal is not to collect tests. It is to protect the connections that make the project a complete product.

## What the project demonstrates

MoviesFlutter goes beyond consuming a public API. It connects an outside source to owned data, protects actions by user, and keeps the experience coherent across several screens.

The most useful next steps would be integration tests for authentication and favorite routes, clearer offline states, and an accessibility review of the mobile screens. These are concrete improvements tied to behavior that already exists.

## References

- [Flutter: Guide to app architecture](https://docs.flutter.dev/app-architecture/guide)
- [TMDB: Getting Started](https://developer.themoviedb.org/docs/getting-started)
- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [PostgreSQL: Unique Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)

**Explore the code and original screenshots:** [MoviesFlutter repository](https://github.com/vsmarlon/MoviesFlutter)
