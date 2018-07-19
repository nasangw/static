import arrayDungeons from './data-dungeons';

export default class dungeons {
    constructor(options) {
        // define properties
        this.options = options;
        this.currentLevelGrade = this.options.defaultLevelGrade;
        this.currentTribe = this.options.isDefaultArteia ? 'arteia' : 'besides-arteia';
        this.selectedDungeon = -1;
        this.el = document.querySelector('#dungeons');
        this.btnLevelGrade = document.querySelectorAll('#dungeonsHeader .btn-level');
        this.btnTribes = document.querySelectorAll('#dungeonsHeader .btn-tribes');
        this.isInit;

        // execute methods
        this.init();
    }

    init() {
        this.initInteraction();
        this.activateDefaultSet();
        this.handleEvent();
    }

    initInteraction() {
        if(!this.isInit && !this.el.classList.contains('init')) {
            this.el.classList.add('init');
            this.isInit = true;
        }
    }

    switchColorLevelGrade(newLevel) {
        if(!newLevel) {
            return;
        }

        if(this.el.classList.contains(`level-grade${this.currentLevelGrade}`)) {
            this.el.classList.remove(`level-grade${this.currentLevelGrade}`);
            this.el.classList.add(`level-grade${newLevel}`);
        }
    }

    hideBtnLevelGrade() {
        const btnArteia = document.querySelectorAll('#dungeonsHeader .btn-level[data-tribe="arteia"]');
        const btnBesidesArteia = document.querySelectorAll('#dungeonsHeader .btn-level[data-tribe="besides-arteia"]');
        const target = this.currentTribe === 'besides-arteia' ? btnArteia : btnBesidesArteia;

        for(var i=0;i < this.btnLevelGrade.length; i++) {
            this.btnLevelGrade[i].style.display = 'inline-block';
        }

        for(var i=0; i < target.length; i++) {
            target[i].style.display = 'none';
        }
    }

    activateDefaultSet() {
        const btnTribeInit = this.currentTribe === 'arteia' ? this.btnTribes[1] : this.btnTribes[0];
        const btnLevelGradeInit = document.querySelector(`#dungeonsHeader .btn-level:nth-child(${this.options.defaultLevelGrade + 1})`);

        btnTribeInit.classList.add('active');
        btnLevelGradeInit.classList.add('active');
        this.setElement({
            levelGrade: this.currentLevelGrade,
            currentTribe: this.currentTribe,
        });
    }

    ctrlActiveBtnTribes(newElem) {
        if(!newElem) {
            return;
        }
        const pastElem = document.querySelector(`#dungeonsHeader .btn-tribes[data-tribe="${this.currentTribe}"]`);

        pastElem.classList.remove('active');
        newElem.classList.add('active');
    }
    
    ctrlActiveBtnLevelGrade(newElem) {
        if(!newElem) {
            return;
        }
        const pastElem = document.querySelector(`#dungeonsHeader .btn-level[data-level-grade="${this.currentLevelGrade}"]`);

        pastElem.classList.remove('active');
        newElem.classList.add('active');
    }
    
    handleEvent() {
        this.el.addEventListener('click', function(ev) {
            if(ev.target.getAttribute('id') !== 'dungeons' || this.selectedDungeon < 0) {
                return;
            }
            this.deActivateDungeon();
        }.bind(this), false);

        for(var i=0; i < this.btnTribes.length; i++) {
            this.btnTribes[i].addEventListener('click', this.onclickBtnTribes.bind(this), false);
        }

        for(var i=0; i < this.btnLevelGrade.length; i++) {
            this.btnLevelGrade[i].addEventListener('click', this.onclickBtnLevelGrade.bind(this), false);
        }
    }

    eventHandlerTableRow() {
        this.dungeonsTableRow = $('#dungeonTable .dungeon-tr');
        this.dungeonsTableRow.on('click', this.onclickDungeon.bind(this));
    }

    eventHandlerBtnMarker() {
        this.btnMarker = $('#dungeonSpotList .btn-marker');
        this.btnMarker.on('click', this.onclickDungeon.bind(this));
    }

    onclickBtnTribes(ev) {
        const elem = ev.target;
        const elemTribe = elem.getAttribute('data-tribe');
        const btnLevelGrade = document.querySelector(`#dungeonsHeader .btn-level[data-level-grade="${this.options.defaultLevelGrade}"]`);

        this.switchColorLevelGrade(this.options.defaultLevelGrade);
        this.ctrlActiveBtnTribes(elem);
        this.ctrlActiveBtnLevelGrade(btnLevelGrade);
        this.setElement({
            levelGrade: this.options.defaultLevelGrade,
            currentTribe: elemTribe,
        });
        this.currentTribe = elemTribe;

        // reset currentLevelGrade
        this.currentLevelGrade = this.options.defaultLevelGrade;
    }

    onclickBtnLevelGrade(ev) {
        const elem = ev.target;
        const elemLevelGrade = elem.getAttribute('data-level-grade');

        this.switchColorLevelGrade(elemLevelGrade);
        this.ctrlActiveBtnLevelGrade(elem);
        this.setElement({
            levelGrade: elemLevelGrade,
            currentTribe: this.currentTribe,
        });
        this.currentLevelGrade = elemLevelGrade;

        // reset selectedDungeon
        this.resetSelectedDungeon();
    }

    onclickDungeon(ev) {
        const elem = ev.currentTarget;
        this.activateDungeon(elem);
    }

    activateDungeon(target) {
        if(!target) {
            return;
        }

        const elemIndex = parseInt(target.getAttribute('data-index'));

        if(this.selectedDungeon > -1) {
            this.dungeonsTableRow[this.selectedDungeon].classList.remove('active');
            this.btnMarker[this.selectedDungeon].parentNode.classList.remove('active');
        }

        $(this.dungeonsTableRow).eq(elemIndex).addClass('active');
        $(this.btnMarker).eq(elemIndex).parent().addClass('active');
        this.selectedDungeon = elemIndex;
    }

    deActivateDungeon() {
        this.dungeonsTableRow[this.selectedDungeon].classList.remove('active');
        this.btnMarker[this.selectedDungeon].parentNode.classList.remove('active');

        // reset selectedDungeon
        this.resetSelectedDungeon();
    }

    resetSelectedDungeon() {
        this.selectedDungeon = -1;
    }

    setElement(options) {
        const dungeonTable = document.querySelector('#dungeonTable');
        const dungeonTableTbody = document.querySelector('#dungeonTable tbody');
        const dungeonSpotList = document.querySelector('#dungeonSpotList');
        const trasitionDuration = 500;
        const data = this.getSortData(options);
    
        // 던전 테이블
        dungeonTable.classList.remove('active');
        dungeonTable.classList.remove('enable-click');
        // this.activateDungeonTable(data.length);

        // 던전 마커
        dungeonSpotList.classList.remove('active');
        dungeonSpotList.innerHTML = this.getTemplateDungeonSpot(data);

        setTimeout(() => {
            // 던전 테이블
            this.activateDungeonTable(data.length);

            dungeonTableTbody.innerHTML = this.getTemplateDungeonTable(data);
            // this.eventHandlerTableRow();

            dungeonSpotList.classList.add('active');
            this.eventHandlerBtnMarker();
        }, trasitionDuration);
    }

    activateDungeonTable(length) {
        if(typeof length !== 'number' && length < 0) {
            return;
        }

        const dungeonTable = document.querySelector('#dungeonTable');
        const trasitionDuration = 250;
        dungeonTable.classList.add('active');
        setTimeout(() => {
            this.eventHandlerTableRow();
            dungeonTable.classList.add('enable-click');
        }, trasitionDuration * length);
    }

    getSortData(options) {
        // options = {
        //     levelGrade: 3,
        //     currentTribe: 'arteia',
        // };

        if(!options || !Object.keys(options).length) {
            return;
        }

        return options.currentTribe === 'arteia' ? 
            arrayDungeons.filter(d => d.levelGrade === parseInt(options.levelGrade) && d.category !== 'beside-arteia') : 
            arrayDungeons.filter(d => d.levelGrade === parseInt(options.levelGrade) && d.category !== 'arteia');
    }

    getTemplateDungeonTable(target) {
        if(!target) {
            return;
        }

        return `
            ${target.map((d, index) => {
                return `
                    <tr class="dungeon-tr" data-index="${index}">
                        <td>${d.name}</td>
                        <td class="level">Lv ${d.levelStart} ~ ${d.levelEnd}</td>
                        <td class="center"><span class="marker"></span></td>
                    </tr>`;
            }).join('')}
        `;
    }

    getTemplateDungeonSpot(target) {
        if(!target) {
            return;
        }
    
        return `
            ${target.map((d, index) => {
                let className = d.posX < 1000 ? 'dungeon' : 'dungeon reverse';
                return `
                    <li class="${className}" style="top: ${d.posY}px;left: ${d.posX - 4}px;">
                        <button type="button" class="btn-marker" data-index="${index}"></button>
                        <div class="tooltip">
                            <span class="dungeon__name">${d.name}</span>
                            <div class="dungeon__level">Lv${d.levelStart} ~ ${d.levelEnd}</div>
                        </div>
                    </li>`;
            }).join('')}
        `;
    }
}