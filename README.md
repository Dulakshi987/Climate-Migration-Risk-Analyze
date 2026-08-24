# Climate Risk Analysis & AI Advisor

A data-driven Climate Risk Analysis and AI Advisory System designed to analyze climate-related risks and provide users with understandable, context-aware insights and recommendations. The system combines a modern web interface, backend services, climate data integration, database management, and an AI-powered advisory layer.

##  Key Features

###  Climate Risk Analysis
- Analyze climate-related risk indicators
- Process and visualize climate data
- Provide data-driven risk insights
- Present risk information through an interactive interface

###  AI Climate Advisor
- AI-powered conversational advisor
- Interpret climate-risk analysis results
- Answer user questions related to identified risks
- Explain potential climate impacts
- Provide context-aware recommendations and mitigation suggestions

### Data Management
- Persistent storage using MySQL
- Dynamic data retrieval through RESTful APIs
- Structured climate-risk data management
- Integration with external climate and weather data sources

###  User Features
- User authentication
- Interactive climate-risk dashboard
- Dynamic data visualization
- AI Advisor interaction
- Personalized climate-risk insights

##  System Architecture

```text
                    ┌─────────────────────┐
                    │      Next.js        │
                    │    Frontend UI      │
                    └──────────┬──────────┘
                               │
                         RESTful APIs
                               │
                    ┌──────────▼──────────┐
                    │    Java Spring      │
                    │       Boot          │
                    │      Backend        │
                    └───────┬──────┬──────┘
                            │      │
                    ┌───────▼─┐  ┌─▼─────────────┐
                    │  MySQL  │  │ AI Advisor    │
                    │ Database│  │   Qwen LLM    │
                    └─────────┘  └───────────────┘
