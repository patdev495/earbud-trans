# 0004. Direct Client-to-API Integration for Mobile Client

For the initial MVP phase, we decided to communicate directly from the mobile app to the Groq Speech-to-Text API using an app-level environment variable (`EXPO_PUBLIC_GROQ_API_KEY`) rather than routing through a dedicated proxy server. This eliminates the need to manage and host a backend server, allowing seamless mobile testing anywhere over Wi-Fi or cellular networks and enabling rapid multi-machine development.
