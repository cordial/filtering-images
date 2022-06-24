import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import Carousel from 'nuka-carousel';
import Slider from '../components/Slider'
import SidebarItem from '../components/SidebarItem'
import fileSaver from "file-saver";
import {Color, RGBColor, SketchPicker} from 'react-color';

const DEFAULT_OPTIONS = [
  {
    name: 'Brightness',
    property: 'brightness',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Contrast',
    property: 'contrast',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Saturation',
    property: 'saturate',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Grayscale',
    property: 'grayscale',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Sepia',
    property: 'sepia',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Hue Rotate',
    property: 'hue-rotate',
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: 'deg'
  },
  {
    name: 'Blur',
    property: 'blur',
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: 'px'
  }
]

const Home: NextPage = () => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [color, setColor] = useState<RGBColor>({r:250, g:250, b:210, a:0})
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const selectedOption = options[selectedOptionIndex]

  function handleSliderChange(value:number) {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option
        return { ...option, value: value }
      })
    })
  }

  function handleExport(){
    var blob = new Blob([JSON.stringify(options)], {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(
        blob,
        "filters.txt"
    );
  }

  function getImageStyle(fileName:string) {
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })
    return { filter: filters.join(' '), backgroundImage: `linear-gradient(to right, rgba(${color.r }, ${color.g }, ${color.b }, ${color.a }) 0%, rgba(${color.r }, ${color.g }, ${color.b }, ${color.a }) 100%), url(${fileName})` }
  }

  const files = [
    'stock/_1_Robotics.jpg',
    'stock/_1_PicassoArt.jpg',
    'stock/_1_Guitar.jpg',
    'stock/_1_Lights.jpg',
    'stock/_2_BackBendColumns.jpg',
  ];

  const newFiles = (() => {
    let fileNames = [];
    for(let i=1;i<=30;i++) {
      fileNames.push('File-' + i + '.jpg');
    }
    return fileNames.concat(files);
  });

  function handleClick() {
    setDisplayColorPicker(!displayColorPicker)
  };

  function handleClose() {
    setDisplayColorPicker(false)
  };

  function onChangeComplete(){
    return { background: `rgba(${color.r }, ${color.g }, ${color.b }, ${color.a })`}
  }

  return (
      <>

        <div className="container">
          <div className="carousel">
            <Carousel
                // @ts-ignore
                renderBottomCenterControls={false}
                wrapAround={true}
                slidesToShow={1}>
              {newFiles().map((file, index) => {
                return <div key={index} className="main-image" style={getImageStyle("/"+ file)}  />
              })}
            </Carousel>
          </div>
          <div className="sidebar">

            <>{options.map((option, index) => {
              return (
                  <SidebarItem
                      value={option.value}
                      key={index}
                      name={option.name}
                      active={index === selectedOptionIndex}
                      handleClick={() => setSelectedOptionIndex(index)}
                  />
              )
            })}
              <button className="export"
                  onClick={handleExport}
              >
                Export
              </button>
              <div className="color-picker">
                <div className="swatch" onClick={ handleClick }>
                  <div className="color" style={onChangeComplete()}/>
                </div>{ displayColorPicker ? <div className="popover">
                <div className="cover" onClick={ handleClose }/>
                <SketchPicker color={ color } onChange={(color) => setColor(color.rgb)} />
              </div> : null }
              </div>
            </>
          </div>
          <Slider
              min={selectedOption.range.min}
              max={selectedOption.range.max}
              value={selectedOption.value}
              handleChange={(e:React.ChangeEvent<HTMLInputElement>)=> handleSliderChange(parseInt(e.target.value))}
          />
        </div></>
  )
}

export default Home
