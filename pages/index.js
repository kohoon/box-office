import axios from "axios";
import Head from "next/head";
import Error from "next/error";
import Link from "next/link";
import Router from "next/router";
import { DatePicker } from "antd";
import moment from "moment";
function Home(props) {
    if (props.error) {
        return <Error statusCode={500} title={props.error.message} />;
    }
    if (props.data.faultInfo) {
        return <Error statusCode={500} title={props.data.faultInfo.message} />;
    }

    return (
        <div>
            <Head>
                <title>Box Office</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>박스 오피스</h1>

            <DatePicker
                defaultValue={moment(props.targetDt, "YYYYMMDD")}
                dateFormat={"YYYYMMDD"}
                onChange={(date) =>
                    Router.push("/?targetDt=" + date.format("YYYYMMDD"))
                }
            />
            {props.data.boxOfficeResult.dailyBoxOfficeList.map((item) => (
                <div key={item.movieCd}>
                    [{item.rank}]&nbsp;
                    <Link href="/movies/[code]" as={"/movies/" + item.movieCd}>
                        <a>{item.movieNm}</a>
                    </Link>
                    <small>({item.openDt})</small>
                </div>
            ))}
        </div>
    );
}

Home.getInitialProps = async function (context) {
    const targetDt =
        context.query.targetDt ||
        moment().subtract(1, "day").format("YYYYMMDD");
    let url =
        "https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";
    url += "?key=5902cbfeb5a92a72b034314befe3d771";
    url += "&targetDt=" + targetDt;
    // Promise 패턴 -> async/await 패턴으로 변경하는 작업 필요
    try {
        const response = await axios.get(url);
        console.log(response.data);
        return {
            targetDt,
            data: response.data
        };
    } catch (error) {
        console.warn(error);
        return { error };
    }
};

export default Home;
