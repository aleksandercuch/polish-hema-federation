Polish HEMA Federation Platform

Production-grade content management platform for a historical European martial arts federation, enabling administrators to manage events, news, and organizational content without developer involvement.

👉 Live: https://polish-hema-federation.pl/en

Problem

The federation lacked a centralized, maintainable system to manage events, announcements, and structured information.

Key challenges:

Frequent content updates managed by non-technical users
Need for strong SEO and discoverability
Structured presentation of events and federation data
Minimizing developer involvement in day-to-day updates
Solution

Designed and implemented an admin-driven platform that allows non-technical users to manage all key content directly from the application.

The system combines:

dynamic content management
structured data modeling
SEO-optimized rendering
Core Capability

The platform enables administrators to:

create and manage events (tournaments, workshops)
publish news and federation updates
maintain structured organizational content
update the website without touching code

This significantly reduces operational overhead and removes dependency on developers for content updates.

Architecture & Key Decisions
Next.js (SSR/SSG hybrid) → optimize SEO and performance
Firebase (Firestore + Hosting) → fully managed backend with minimal operational overhead
Admin-driven architecture → dynamic content controlled via internal interface
Separation of concerns → clear boundary between admin layer and public UI
Structured data model → supports future scalability (rankings, users, integrations)
Trade-offs
Chose Firebase over custom backend → faster development, less control over complex querying
Balanced static rendering with dynamic updates → improved performance while preserving flexibility
Avoided over-engineering → prioritized delivery speed and maintainability
System Model

The system is centered around admin-managed content stored in Firestore.

Key entities:
Event → tournaments, workshops, federation activities
Article / News → announcements and updates
Federation Content → static organizational information
Data flow:

Admin → creates/updates content → stored in Firestore → rendered on public pages

Data Layer
Firestore used as primary database for dynamic content
Real-time capable architecture (not fully leveraged, but supported)
Flexible schema enabling incremental feature expansion
Core Features
Admin panel for content management
Event management system
News and article publishing
Structured federation information
SEO optimization (semantic HTML, metadata, rendering strategy)
Performance & Quality
Optimized rendering strategy (SSR/SSG mix)
Efficient data fetching from Firestore
Mobile-first design
Lighthouse-focused improvements (performance, accessibility, SEO)
Clean, maintainable and modular codebase
Tech Stack
Frontend: Next.js / React
Language: TypeScript
Backend: Firebase
Database: Firestore
Hosting: Firebase Hosting
Tooling: ESLint, Prettier
My Role

Full ownership of the system:

requirements gathering and problem definition
architecture design and key technical decisions
implementation of admin panel and public UI
data modeling (Firestore)
performance and SEO optimization
deployment and production delivery
Impact
Enables non-technical administrators to fully manage federation content
Eliminates need for developer involvement in daily updates
Provides a scalable foundation for future features (rankings, user accounts, integrations)
Used in production by a real organization
Engineering Takeaways
Designing systems for non-technical users requires simplicity and clarity
Backend-as-a-Service (Firebase) is effective for rapid delivery under constraints
Structuring content early enables long-term scalability
Balancing dynamic data with SEO is a key architectural challenge
System Design Considerations

If the platform scaled, I would:

extract a dedicated backend/API layer
introduce role-based access control (RBAC)
implement caching (CDN + API-level)
add audit logs for admin actions
optimize querying and indexing strategies in Firestore
introduce pagination and data partitioning for large datasets
What I Would Do Differently
Introduce more advanced data modeling for rankings and competition results
Improve admin UX for bulk content operations
Add analytics and monitoring (e.g. user behavior, performance tracking)
Expand system into a full federation management platform
Future Improvements
Ranking system for fighters and events
User accounts and authentication layers
Integration with external systems (e.g. event registration)
Advanced CMS capabilities
Contact

Feel free to reach out if you'd like to discuss architecture decisions or implementation details.
