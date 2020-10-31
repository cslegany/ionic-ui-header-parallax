import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appParallaxHeader]'
})
export class ParallaxHeaderDirective implements OnInit {
  header: Element;
  headerHeight: number;
  moveImage: number;
  scaleImage: number;

  constructor(public element: ElementRef, public renderer: Renderer2,
    private domCtrl: DomController) {
  }

  ngOnInit() {
    let content: HTMLElement = this.element.nativeElement; //this.element ==> ionContent in home.page
    this.header = content.getElementsByClassName('parallax-image')[0]; //div class="parallax-image"

    //domCtrl is required to build the most performant animations
    this.domCtrl.read(() => {
      this.headerHeight = this.header.clientHeight;
      //console.log('height: ', this.headerHeight);
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    //console.log('EVENT: ', $event);
    const scrollTop = $event.detail.scrollTop;
    //console.log('scroll: ', scrollTop);

    this.domCtrl.write(() => {
      if (scrollTop > 0) {
        this.moveImage = scrollTop / 2;
        this.scaleImage = 1;
      } else { //pull upwards on iOS
        this.moveImage = scrollTop / 1.4;
        this.scaleImage = -scrollTop / this.headerHeight + 1; //add 1 to avoid 0
      }

      this.renderer.setStyle(this.header, 'webkitTransform',
        'translate3d(0,' + this.moveImage + 'px,0) scale(' + this.scaleImage + ',' + this.scaleImage + ')'
      );
    });
  }

}
