FROM node:20 AS Builder

WORKDIR /usr/src/app

# Install backenddependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all sources 
COPY . .

# Build frontend
RUN cd frontend && npm run build

#----------------------------------------------------------

# Production image
FROM node:20

WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=Builder /usr/src/app/frontend/dist ./public
COPY --from=Builder /usr/src/app/backend ./

# Install backend dependencies
RUN npm install --production

EXPOSE 5050
CMD [ "node", "index.js" ]
