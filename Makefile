all: up

up:
	docker compose -f docker-compose.yml up --build # -d

down:
	docker compose -f docker-compose.yml down

clean: down
	docker system prune -af

fclean: clean
	docker stop $$(docker ps -a -q)
	docker rm $$(docker ps -a -q)
	docker rmi -f $$(docker images -q)
	docker network prune

re: down up

.PHONY: all up down clean re