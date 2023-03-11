<template>
    <div style="background-color: #f5f6f7;height: 100vh">
        <van-nav-bar style="height: 65px" class="chat-header" :border=false>
            <template #left>

            </template>
            <template #right>
                <van-icon style="transform:rotate(90deg);" name="ellipsis" color="#333333" size="25" />
            </template>
        </van-nav-bar>

        <div class="chat-main" style="">
            <div v-for="(item, index) in msgList" :key="index">
                <div v-if="item.isReceived === false" class="message-item right">
                    {{ item.content }}
                </div>
                <div v-else class="message-item">
                    {{ item.content }}
                </div>
                <div class="item-occupy" />
            </div>
        </div>

        <div class="chat-bar">

            <van-cell-group :border="false" style="margin-top: 8px">
                <van-field v-model="inputMsg" placeholder="Type message..." />
            </van-cell-group>
            <div class="chat-bar-btn listen" @touchstart.prevent="start_touch()" @touchmove.prevent="move_touch()"
                @touchend.prevent="stop_touch()">
                <font-awesome-icon class="chat-bar-btn-microphone" icon="fa-microphone" />
            </div>
            <div class="chat-bar-btn send" @click="sendMessage">

                <svg x="1589271304274" class="chat-bar-btn-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                    p-id="3034" width="30" height="30">
                    <path d="M85.76 896l895.573333-384-895.573333-384-0.426667 298.666667 640 85.333333-640 85.333333z"
                        p-id="3035" fill="#ffffff"></path>
                </svg>
            </div>
        </div>
        <div class="spinner" v-show="isListening">
            <font-awesome-icon icon="fa-solid fa-spinner fa-spin-pulse" spin />
        </div>
    </div>
</template>

<script>
import Recorder from 'js-audio-recorder';

export default {
    name: "index",

    data() {
        return {
            inputMsg: '',
            isListening: false,
            recorder: new Recorder(),
            ws: {},
            user: {},
            msgList: [
                {
                    isReceived: true,
                    type: "text",
                    content: 'Hello !',
                }
            ]
        };
    },

    mounted() {
    },

    methods: {
        async sendMessage() {
            if (this.inputMsg == "" || typeof this.inputMsg === "undefined")
                return;
            const msg = {
                isReceived: false,
                content: this.inputMsg,
                type: "text"
            };
            this.msgList.push(msg);
            this.inputMsg = '';
            const res = await this.$http.post(`/web`, msg);
            this.msgList.push(res.data);
        },

        start_touch(item) {
            var self = this;
            this.timeOutEvent = setTimeout(function () {
                self.start_listen(item);
            }, 300);
            return false;
        },
        stop_touch(item) {
            clearTimeout(this.timeOutEvent);
            this.isListening = false;
            this.uploadRecord();
            console.log(this.recorder.getWAVBlob());
            // if (this.timeOutEvent != 0) {
            //     console.log("click");
            // }
            return false;
        },

        move_touch() {
            // do nothing
            clearTimeout(this.timeOutEvent);
            this.timeOutEvent = 0;
            this.isListening = false;
        },

        start_listen(val) {
            this.timeOutEvent = 0;
            this.isListening = true
            this.listen();
        },

        listen() {
            console.log("listening");
            this.recorder = new Recorder();
            var self = this;
            Recorder.getPermission().then(() => {
                console.log('start recording')
                self.recorder.start();
            }, (error) => {
                console.log(`${error.name} : ${error.message}`)
            })
        },

        async uploadRecord() {
            if (this.recorder == null || this.recorder.duration === 0) {
                console.log("there is no voice");
                return false
            }
            this.recorder.stop();
            this.recorder.play();
            this.timer = null
            console.log('uploading')

            let config = {
                headers: { "Content-Type": "multipart/form-data" },
            };


            const formData = new FormData()
            const voice = this.recorder.getWAVBlob()
            const newbolb = new Blob([voice], { type: 'audio/wav' })
            const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
            formData.append('data', fileOfBlob)
            await this.$http.post("/web/voice", formData, config).then(res => {
                console.log(res.data.data[0].url)
            })
        }


    }
}
</script>

<style scoped>
@import "../../assets/css/chat.css";
</style>