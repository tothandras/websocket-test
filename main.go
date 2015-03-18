package main

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func readLoop(c *websocket.Conn) {
	for {
		if _, _, err := c.NextReader(); err != nil {
			c.Close()
			break
		}
	}
}

func tickerHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	go readLoop(ws)

	ticker := time.NewTicker(time.Second)
	i := 0
	for _ = range ticker.C {
		log.Println(i)
		i++
		err = ws.WriteMessage(websocket.TextMessage, []byte(strconv.Itoa(i)))
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	url := r.URL.String()
	if strings.Contains(url, ".") {
		url = "/"
	}
	http.StripPrefix(url, http.FileServer(http.Dir("static"))).ServeHTTP(w, r)
}

func main() {
	http.HandleFunc("/", fileHandler)
	http.HandleFunc("/tick", tickerHandler)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}
