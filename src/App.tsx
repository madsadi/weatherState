import React, {useEffect, useState} from 'react';
import moment from "jalali-moment";
import './App.css';
import axios from 'axios';
import styled, {keyframes} from "styled-components";
import {Post} from './types'
import {space, SpaceProps} from "styled-system";
import {initialize} from "jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit";

const SearchBox = styled.div`
    display:flex;
    flex-direction:column;
    height:200px;
    width:300px;
    margin:auto;
    position:relative;
`

const Input = styled.input`
    background:white;
    border:1px solid white;
    outline:none;
    width:100%;
    min-height:35px;
    padding:0 5px;
    margin-bottom:5px;
`
const Clear = styled.button`
    background:black;
    padding:3px 5px;
    font-size:12px;
    color:white;
    border:none;
    outline:none;
    position:absolute;
    right:8px;
    top:8px;
    border-radius:50%;
    text-align:center;
    cursor:pointer;
`
const Results = styled.div`
    background:white;
    border-bottom-right-radius:8px;
    border-bottom-left-radius:8px;
    max-height:max-content;
    width:100%;
    overflow-y:scroll;
    text-align:left;
    padding:5px;
    &::-webkit-scrollbar{
        display:none;
    }
    &>div{
        margin-bottom:5px;
    }
`

const Item = styled.div`
    display:flex;
    cursor:pointer;
`

const fadeIn = keyframes`
 0% { opacity:0 }
 100% { opacity:1 }
`

const DataCard = styled.div`
    display:flex;
    flex-direction:column;
    position:fixed;
    top:50%;
    right:50%;
    transform:translate(50%,-50%);
    background:white;
    border-radius:8px;
    padding:16px;
    width:300px;
    margin:auto;
    filter: drop-shadow(2px 1px 5px #dddddd);
    transition:all 1s;
    animation-name: ${fadeIn};
     animation-duration: 1s;
     animation-iteration-count: 1;
    &:hover{
        filter: drop-shadow(2px 1px 20px #4444dd);
        transform: scale(1.1) translate(50%,-50%);
    }
`

const Flex = styled.div`
    display:flex;
    position:relative;
    padding-bottom:16px;
    &.align{
        align-items:center;
    }
    &.line::after{
        content:"";
        position:absolute;
        bottom:0;
        background:#e8e8ec;
        height:1px;
        width:100%;
        right:0;
    }
`

const Name = styled.div`
    flex:1 1;
`
const Description = styled.div`
    color:grey;
    font-size:12px;
`
const Info = styled.div<SpaceProps>`
    color:grey;
    font-size:14px;
    &:not(:last-child){
        margin-bottom:8px;
    }
    ${space}
`
const Main = styled.div`
    flex:1 1 50%;
    text-align:left;
    margin-top:16px;
    display:flex;
    flex-direction:column;
`

function App() {
    const [data, setData] = useState<Post | any>({})
    const [dic, setDictionary] = useState([])
    const [city, setCity] = useState('')
    const [findings, setFindings] = useState([])
    const [id, setId] = useState(0)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getData(id);
    }, [id])

    useEffect(() => {
        getCities()
    }, [])

    async function getCities() {
        await axios.get('http://localhost:3000/posts')
            .then(response => {
                setDictionary(response.data)
            })
    }

    async function getData(id: number) {
        let url = `http://api.openweathermap.org/data/2.5/weather?id=${id}&lang=en&units=metric&appid=a9ced0c8223ff0a08d1f1a78807540f6`
        await axios.get(url)
            .then(response => {
                setData(response.data);
                setLoading(true)
            })
            .catch((error) => {
                console.error('error fetching data', error)
            })
    }

    function handleSearch(e: any) {
        setCity(e.target.value)
    }

    useEffect(() => {
        let targetCities = dic.filter((item: Post) => (item.name).includes(city))
        setFindings(targetCities)
    }, [city])


    function secondToTime(duration: number, timeZone: number) {
        var seconds: any = Math.floor(duration % 60),
            minutes: any = Math.floor((duration / (60)) % 60),
            hours: any = Math.floor((duration / (60 * 60)) % 24);

        var Tseconds: any = Math.floor(timeZone % 60),
            Tminutes: any = Math.floor((timeZone / (60)) % 60),
            Thours: any = Math.floor((timeZone / (60 * 60)) % 24);

        hours = ((hours + Thours) < 10) ? "0" + (hours + Thours) : (hours + Thours);
        minutes = ((minutes + Tminutes) < 10) ? "0" + (minutes + Tminutes) : (minutes + Tminutes);
        seconds = ((seconds + Tseconds) < 10) ? "0" + (seconds + Tseconds) : (seconds + Tseconds);
        return hours + ":" + minutes + ":" + seconds;
    }

    function handleClear() {
        setCity('')
        setLoading(true)
        setId(0)
    }

    return (
        <div className="App">
            <SearchBox>
                <Input type={'text'} value={city}
                       onChange={(e: any) => handleSearch(e)}/>
                {city !== '' && <Clear onClick={handleClear}>X</Clear>}
                {findings.length > 0 && city !== '' ? <Results>
                    {findings.map((item: Post) => <Item onClick={() => setId(item.id)}
                                                        key={item.id}>{item.name}</Item>)}
                </Results> : null}
            </SearchBox>
            {loading && city !== '' && id!==0 ? <DataCard>
                <Flex className={'line align'}>
                    <div>
                        <img className={'icon'}
                             src={` http://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}.png`}/>
                        <Description>{data?.weather?.[0]?.description}</Description>
                    </div>
                    <Name>{data?.name} , {data?.sys?.country}</Name>
                </Flex>
                <Flex className={'line'}>
                    <Main>
                        <h6>Info</h6>
                        {
                            Object?.entries(data?.main).map((value: [string, unknown], index: number) => {
                                return <Info key={index}>{value?.[0]} : {value?.[1]}</Info>
                            })
                        }
                    </Main>
                    <Main>
                        <h6>Wind</h6>
                        {
                            Object?.entries(data?.wind).map((value: [string, unknown], index: number) => {
                                return <Info key={index}>{value?.[0]} : {value?.[1]}</Info>
                            })
                        }
                        <Info mt={'auto'}>
                            visibility: {data?.visibility / 1000} km
                        </Info>
                    </Main>
                </Flex>
                <Flex>
                    <Main>
                        <Info>
                            sunrise : {secondToTime(data?.sys?.sunrise, data?.timezone)}
                        </Info>
                    </Main>
                    <Main>
                        <Info>
                            sunset : {secondToTime(data?.sys?.sunset, data?.timezone)}
                        </Info>
                    </Main>
                </Flex>
            </DataCard> : null}
        </div>
    );
}

export default App;
