<template>
    <div >
        <van-nav-bar class="chat-header" :border=false>

        </van-nav-bar>

        <div class="chat-main" id="container" style="">
            <div v-for="(item, index) in msgList" :key="index">
                <div v-if="item.isReceived === false" class="message-item right">
                    <div v-if="item.type === 'text'">
                        {{ item.content }}
                    </div>
                    <div v-else @click="playSound(item.content)">
                        <font-awesome-icon icon="fa-solid fa-play" /> &nbsp;
                        <font-awesome-icon icon="fa-solid fa-ellipsis" />
                    </div>
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
            ],
            voice_num: 0,
            voiceList: [

            ]
        };
    },

    mounted() {
    },

    methods: {
        async sendMessage() {
            if (this.inputMsg == "" || typeof this.inputMsg === "undefined")
                return;
            var msg = {
                isReceived: false,
                type: "text",
                content: this.inputMsg,
            };
            this.msgList.push(msg);
            this.inputMsg = '';
            const res = await this.$http_text.post(`/web`, msg);
            console.log(res);
            res.data.data.isReceived = true
            this.msgList.push(res.data.data);
        },

        start_touch(item) {
            var self = this;
            this.timeOutEvent = setTimeout(function () {
                self.start_listen(item);
            }, 100);
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

        playSound(index) {
            console.log(index);
            var recorder = this.voiceList[index]
            recorder.play()
        },

        async uploadRecord() {
            if (this.recorder == null || this.recorder.duration === 0) {
                console.log("there is no voice");
                return false
            }
            var self = this
            this.recorder.stop();
            this.voiceList.push(this.recorder)

            // this.recorder.play();
            const msg = {
                isReceived: false,
                type: "voice",
                content: this.voice_num++,
            };
            this.msgList.push(msg)
            this.timer = null
            console.log('uploading')

            let config = {
                headers: { "Content-Type": "multipart/form-data" },
            };


            const formData = new FormData()
            const voice = this.recorder.getWAVBlob()
            const newbolb = new Blob([voice], { type: 'audio/wav' })
            const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
            formData.append('file', fileOfBlob)
            await this.$http_voice.post("/voice", formData, config).then(res => {
                console.log(res);
                if (res.status == 200) {
                    console.log(res.data.data);
                    var msg = res.data.data
                    self.msgList.push(msg)


                }

            })
        }


    }
}
</script>

<style scoped>
@import "../../assets/css/chat.css";
</style>