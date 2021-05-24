import { Component, OnInit, Input } from '@angular/core';

import { Router }                   from '@angular/router';

@Component({
  selector: 'docs-menu',
  templateUrl: './docs-menu.component.html',
  styleUrls: ['./docs-menu.component.scss']
})
export class DocsMenuComponent implements OnInit {

  @Input("activePath") activePath: string;

  public menuItems = [
    { label: 'About', url: 'about'},
    { label: 'Dev Guide', children: [
      { label: 'Rollbacks', url: 'dev/rollback' }
    ]},
    { label: 'Changelog', url: 'CHANGELOG' },
    { label: 'FAQ', url: 'faq' }
  ];

  constructor(
  	private router: Router
  ) { }

  ngOnInit() {
    console.log(this.activePath);
    this.menuItems.map(item => {
      if(item.children){
        var childrenActive = false;
        item.children.map(item => {
          item["active"] = this.shouldItemBeActive(item)
          // One active child is enough
          childrenActive = item["active"] || childrenActive;
        });
      }
      item["active"] = childrenActive || this.shouldItemBeActive(item);
    });
  }

  shouldItemBeActive(item){
    if(this.activePath === item?.url){
      return true;
    }
    return false;
  }

  navigateDocs(menuItem:any):any{
    if(menuItem.children){
      menuItem.active = !menuItem.active;
      return;
    }
    menuItem.active = true;
    this.router.navigateByUrl('/docs/'+menuItem.url);
  }

  

}
