class ImagesCarousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      images: []
    }
  }

  componentDidMount () {
    this.loadImagesFromServer()
    //setInterval(this.loadImagesFromServer, 2000)
  }

  componentDidUpdate() {
    this.props.afterInit()
  }

  loadImagesFromServer () {
    $.ajax({
      url:     this.props.url,
      success: function (data) {
        // window.console.debug('received', data)
        this.setState({images: data})
      }.bind(this),
    })
  }

  render () {
    if (this.state.images.length > 0) {
      const imageNodes = this.state.images.map(function (img, i) {
        return (
          <FigureBlock key={i} src={img.src} retinaSrc={img.retinaSrc} alias={img.alias} width={img.width}>{img.src}</FigureBlock>
        )
      })

      return (
        <div className="owl-carousel owl-theme">
          {imageNodes}
        </div>
      )
    } else {
      return (
        <strong>No images found.</strong>
      )
    }
  }
}

class FigureBlock extends React.Component {
  render() {
    const figureStyle = {
      width: this.props.width
    }
    const imgClassNames = {
      'img-rounded': true,
      'owl-lazy': true
    }

    const imgProps = {
      dataSrc: this.props.src + '?img=' + this.props.alias,
      dataSrcRetina: this.props.retinaSrc + '?img=' + this.props.alias,
      dataHash: this.props.alias
    }

    // React doesn't accept custom fields:
    // https://facebook.github.io/react/warnings/unknown-prop.html

    return (
      <figure className="item" style={figureStyle}>
        <img className={imgClassNames} src={imgProps.dataSrc} alt={this.props.alias} />
        {/*<img className={imgClassNames} dataSrc={imgProps.dataSrc} dataSrcRetina={imgProps.dataSrc} dataHash={imgProps.dataSrc} alt={this.props.alias} />*/}
      </figure>
    )
  }
}

window.ImagesCarousel = ImagesCarousel
