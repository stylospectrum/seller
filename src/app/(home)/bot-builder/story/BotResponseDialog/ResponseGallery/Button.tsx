import { forwardRef, MouseEvent, useImperativeHandle, useRef, useState } from 'react';
import { Button, Form, FormItem, FormList, Input, Label, Popover, Select } from '@stylospectrum/ui';
import { ButtonDesign, IForm, IInput, IPopover, Placement } from '@stylospectrum/ui/dist/types';
import type { Identifier, XYCoord } from 'dnd-core';
import { html } from 'lit-html';
import { useDrag, useDrop } from 'react-dnd';

import styles from './button.module.scss';
import { useBotUserInputBlocks, useBotVariables } from '@/hooks';
import { BotResponseButton, BotResponseButtonExpr } from '@/model';

import '@stylospectrum/ui/dist/icon/data/delete';
import '@stylospectrum/ui/dist/icon/data/sort';
import '@stylospectrum/ui/dist/select';

interface GalleryButtonProps {
  onDelete: () => void;
  showSort: boolean;
  index: number;
  moveButton: (dragIndex: number, hoverIndex: number) => void;
  defaultValue: BotResponseButton;
  onClick: (callback: Function) => void;
}

interface DragItem {
  index: number;
}

export interface GalleryButtonRef {
  getValue: () => BotResponseButton;
}

const GalleryButton = forwardRef<GalleryButtonRef, GalleryButtonProps>(
  ({ index, moveButton, onDelete, showSort, defaultValue, onClick }, ref) => {
    const [text, setText] = useState<string>(defaultValue.content);
    const [hover, setHover] = useState<boolean>(false);
    const buttonTextDomRef = useRef<IInput>(null);
    const popoverRef = useRef<IPopover>(null);
    const formRef = useRef<IForm>(null);
    const wrapperDomRef = useRef<HTMLDivElement>(null);
    const userInputBlocksQuery = useBotUserInputBlocks();
    const botVariablesQuery = useBotVariables();
    const deletedIds = useRef<string[]>([]);

    const [{ isDragging }, drag, dragPreview] = useDrag(
      () => ({
        type: 'GALLERY_BUTTON',
        item: { index },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [index],
    );

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>(
      {
        accept: 'GALLERY_BUTTON',
        collect(monitor) {
          return {
            handlerId: monitor.getHandlerId(),
          };
        },
        hover(item: DragItem, monitor) {
          if (!wrapperDomRef.current) {
            return;
          }
          const dragIndex = item.index;
          const hoverIndex = index;

          if (dragIndex === hoverIndex) {
            return;
          }

          const hoverBoundingRect = wrapperDomRef.current.getBoundingClientRect();
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const clientOffset = monitor.getClientOffset();
          const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
          }

          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
          }

          moveButton(dragIndex, hoverIndex);
          item.index = hoverIndex;
        },
      },
      [index],
    );

    function handleMouseEnter() {
      if (popoverRef.current?.opened) {
        return;
      }

      setHover(true);
    }

    function handleMouseLeave() {
      setHover(false);
    }

    function handleClick() {
      onClick(() => {
        setHover(false);
        popoverRef.current?.showAt(wrapperDomRef.current!);
        buttonTextDomRef.current?.input.focus();
        formRef.current?.setFieldsValue({
          content: text,
          ['go-to']: formRef.current?.getFieldsValue()['go-to'] || defaultValue.goTo,
          exprs: formRef.current?.getFieldsValue().exprs || defaultValue.exprs || [],
        });
      });
    }

    function handleClose() {
      formRef.current?.resetFields();
      popoverRef.current?.hide();
    }

    function handleOk() {
      const values = formRef.current?.getFieldsValue();
      setText(values?.['content'] as string);
      popoverRef.current?.hide();
    }

    function handleDelete(e: MouseEvent) {
      e.stopPropagation();
      onDelete();
    }

    useImperativeHandle(ref, () => ({
      getValue() {
        const deletedExprs = (defaultValue.exprs || [])
          .filter((expr) => deletedIds.current.includes(expr.id!))
          .map((expr) => ({
            ...expr,
            deleted: true,
          }));
        const exprs = (formRef.current?.getFieldsValue()['exprs'] as BotResponseButtonExpr[]) || [];

        return {
          content: text,
          goTo: (formRef.current?.getFieldsValue()['go-to'] as string) || '',
          exprs: [...deletedExprs, ...exprs],
        };
      },
    }));

    drop(dragPreview(wrapperDomRef));

    return (
      <div className={styles.wrapper}>
        <div
          className={styles['button-wrapper']}
          style={{ opacity: isDragging ? 0 : 1 }}
          data-handler-id={handlerId}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          ref={wrapperDomRef}
        >
          <button className={styles.button}>
            <span className={styles['button-text']}>{text}</span>
          </button>

          {hover && (
            <div className={styles.actions}>
              {showSort && <Button icon="sort" ref={drag} />}
              <Button icon="delete" onClick={handleDelete} />
            </div>
          )}
        </div>
        <Popover
          ref={popoverRef}
          placement={Placement.Left}
          style={{ display: 'none', width: '32rem' }}
        >
          <Button slot="ok-button" onClick={handleOk}>
            Ok
          </Button>
          <Button slot="cancel-button" type={ButtonDesign.Tertiary} onClick={handleClose}>
            Close
          </Button>

          <Form
            ref={formRef}
            initialValues={{ content: text }}
            style={{ padding: '1rem', display: 'block' }}
          >
            <FormItem label="Button text" name="content">
              <Input ref={buttonTextDomRef} />
            </FormItem>

            <FormItem label="Go to" name="go-to">
              <Select
                options={(userInputBlocksQuery.data || []).map((opt) => ({
                  id: opt.id!,
                  name: opt.name!,
                }))}
              />
            </FormItem>

            <Label>Expressions:</Label>

            <FormList
              name="exprs"
              renderChild={(name: number, value: BotResponseButtonExpr) => {
                return html`<div
                  style="display:flex;gap:.5rem;align-items:center;margin-top:.125rem"
                >
                  <stylospectrum-form-item
                    .name=${[name, 'id']}
                    style="margin-bottom:0;display:none;"
                  >
                    <div></div>
                  </stylospectrum-form-item>

                  <stylospectrum-form-item .name=${[name, 'variableId']} style="margin-bottom:0">
                    <stylospectrum-select
                      .options=${(botVariablesQuery.data || []).filter(
                        (opt) => !opt.isSystem && !opt.entity?.name,
                      )}
                    >
                    </stylospectrum-select>
                  </stylospectrum-form-item>

                  <span>=</span>

                  <stylospectrum-form-item .name=${[name, 'value']} style="margin-bottom:0">
                    <stylospectrum-input> </stylospectrum-input>
                  </stylospectrum-form-item>

                  <stylospectrum-button
                    icon="less"
                    type="Tertiary"
                    @click=${() => {
                      formRef.current?.list.exprs.delete(name);

                      if (value?.id) {
                        deletedIds.current.push(value.id!);
                      }
                    }}
                  >
                  </stylospectrum-button>
                </div> `;
              }}
            />

            <Button
              style={{ width: '100%', marginTop: '.5rem' }}
              type={ButtonDesign.Tertiary}
              onClick={() => formRef.current?.list.exprs.add()}
            >
              Add expression
            </Button>
          </Form>
        </Popover>
      </div>
    );
  },
);

GalleryButton.displayName = 'GalleryButton';

export default GalleryButton;
