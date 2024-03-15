const got = require('got')

async function tiktok(url) {
            // any :/
            let result
            const Konto1 = /video\/([\d|\+]+)?\/?/
            const valid = url.match(Konto1)
            if (valid) {
                return valid[1]
            } else {
                try {
                    const data = await got
                        .get(url, {
                            headers: {
                                "Accept-Encoding": "deflate",
                            },
                            maxRedirects: 0,
                        })
                        .catch((e) => e.response.headers.location)
                    const _url = data
                    const _valid = _url.match(Konto1)
                    if (_valid) {
                        result = _valid[1]
                    }
                } catch (error) {
                    // console.log(error)
                    result = false
                }
            }
            return result
        }
        var valid = tiktok(url)
        //if (!valid) return false // result = false
        const data = got
            .get(API_URL(valid), {
                headers: {
                    "Accept-Encoding": "deflate",
                    "User-Agent": "okhttp/3.14.9",
                },
            })
            .catch((e) => e.response)
        //if (!data) return false // result = false
        const body = JSON.parse(data.body)
        const obj = body.aweme_list.find((o) => o.aweme_id === valid)
        const results = {
            aweme_id: obj.aweme_id,
            region: obj.region,
            desc: obj.desc,
            create_time: obj.create_time,
            author: {
                uid: obj.author.uid,
                unique_id: obj.author.unique_id,
                nickname: obj.author.nickname,
                birthday: obj.author.birthday,
            },
            duration: obj.music.duration,
            download: {
                nowm: obj.video.play_addr.url_list[0],
                wm: obj.video.download_addr.url_list[0],
                music: obj.music.play_url.url_list[0],
                music_info: {
                    id: obj.music.id,
                    title: obj.music.title,
                    author: obj.music.author,
                    is_original: obj.music.is_original,
                    cover_hd: obj.music.cover_hd.url_list[0],
                    cover_large: obj.music.cover_large.url_list[0],
                    cover_medium: obj.music.cover_medium.url_list[0],
                },
            },
        }
        return {
            status: true,
            result: results //data.body //valid
        }
    }
}

function getVideoInfo(video) {
    return `Video description: ${video.description}\n` +
           `🔗 URL: ${video.url}\n` +
           `👤 Author: ${video.author}\n` +
           `❤️ Likes: ${video.likes}\n` +
           `💬 Comments: ${video.comments}\n` +
           `🔁 Shares: ${video.shares}\n` +
           `▶️ Plays: ${video.playCount}\n` +
           `🎵 Music: ${video.music.name} - ${video.music.author}\n` +
           `🖼️ Thumbnail URL: ${video.previewImageUrl}`;
}

function getEmojiCount(count) {
  const emojis = ['👍', '❤️', '🔁', '💬', '🔥'];
  return emojis[Math.floor(Math.random() * emojis.length)] + count.toLocaleString();
}

function getUserProfileInfo(tiktokData) {
  const user = tiktokData.author;
  const stats = tiktokData.statistics;

  return `User Profile:
🆔 Unique ID: ${user.uid}
👤 Nickname: ${user.nickname}
💬 Description: ${tiktokData.desc}
👥 Comments: ${getEmojiCount(stats.comment_count)}
👍 Likes: ${getEmojiCount(stats.digg_count)}
🎵 Music: ${tiktokData.download.music_info.title}`;
}