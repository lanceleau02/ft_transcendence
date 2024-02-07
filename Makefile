# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: hsebille <hsebille@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/02/07 15:37:53 by hsebille          #+#    #+#              #
#    Updated: 2024/02/07 15:37:58 by hsebille         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all: up

up:
	docker compose -f containers/docker-compose.yml up --build -d

down:
	docker compose -f containers/docker-compose.yml down

clean:
	docker system prune -af

fclean: clean
	docker stop $$(docker ps -a -q)
	docker rm $$(docker ps -a -q)
	docker rmi -f $$(docker images -q)
	docker network prune

re: down up

.PHONY: all up down clean re